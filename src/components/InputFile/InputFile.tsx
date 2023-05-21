import { Component, createRef } from 'react';
import { createStore } from 'justorm/react';
import cn from 'classnames';
import pick from 'lodash.pick';
import compare from 'compareq';
import Time from 'timen';

import { Label } from 'uilib/components/Label/Label';
import { Icon } from 'uilib/components/Icon/Icon';
import { Scroll } from 'uilib/components/Scroll/Scroll';
import { toBase64 } from 'uilib/tools/file';
import { spliceWhere } from 'uilib/tools/array';

import S from './InputFile.styl';
import Item from './Item/Item';

import * as T from './InputFile.types';
import { Draggable } from 'uilib';
export * as InputFileTypes from './InputFile.types';

const SCROLL_OFFSET = {
  s: 10,
  m: 12,
  l: 16,
};

const defaultFileState = {
  total: 1,
  loaded: 0,
  error: null,
  base64: '',
};

const buildDefaultState = (src, index, loaded) => ({
  ...defaultFileState,
  loaded,
  index,
  src,
});

export class InputFile extends Component<T.Props> {
  store;
  filesToUpload = []; // [File,...]
  previewRequests = {}; // [index]: Promise
  inputRef = createRef<HTMLInputElement>();
  _mounted = false;

  constructor(props) {
    super(props);

    this.store = createStore(this, {
      items: this.getStateFromProps(),
      labelClipPath: '',
      pickingIndex: null,
      isDragging: false,
    });
  }

  static defaultProps = {
    size: 'm',
    variant: 'default',
    maxCount: 1,
  };

  componentDidMount() {
    this._mounted = true;
    this.props.uploadOnDemand?.(this.demandedUploader);
  }

  componentWillUnmount() {
    this._mounted = false;
    this.store.items.forEach(({ xhr }) => xhr?.abort());
  }

  componentDidUpdate(prevProps) {
    const { value, maxCount } = this.props;

    if (!compare(prevProps.value, value) || prevProps.maxCount !== maxCount) {
      this.store.items = this.getStateFromProps();
    }
  }

  isMultiple = () => this.props.maxCount > 1;

  getStateFromProps() {
    const { value, maxCount, upload } = this.props;
    const loaded = upload ? 1 : 0;

    if (this.isMultiple()) {
      if (maxCount === 1) return [buildDefaultState(value, 0, loaded)];

      return value
        .slice(0, maxCount)
        .map((src, index) => buildDefaultState(src, index, loaded));
    }

    const val = Array.isArray(value) ? value[0] : value;

    return val ? [buildDefaultState(val, 0, loaded)] : [];
  }

  getValFromState = () => {
    const { items } = this.store;

    if (this.isMultiple()) return items.map(({ src, base64 }) => src || base64);

    if (!items[0]) return null;
    return items[0].src || items[0].base64;
  };

  getLastIndex = () => {
    const { value } = this.props;
    return Array.isArray(value) ? value.length : 0;
  };

  filterAllowedFiles(files, index) {
    const { maxCount, limit } = this.props;
    const allowedFiles = [];

    [...files].every(file => {
      if (index >= maxCount) return false;

      if (limit) {
        const sizeMb = file.size / 1024 / 1024;

        if (sizeMb > limit) {
          console.error(`Max file size - ${limit}Mb`, file);
          return false;
        }
      }

      allowedFiles.push(file);
      index++;
      return true;
    }, []);

    return allowedFiles;
  }

  onPlusButtonClick = () => this.inputRef.current.click();

  onItemClick(index) {
    this.store.pickingIndex = index;
    Time.after(50, () => this.inputRef.current.click());
  }

  onDragStart = () => (this.store.isDragging = true);
  onDragEnd = () => (this.store.isDragging = false);

  onChange = async e => {
    const { files } = e.target;
    const { items, pickingIndex } = this.store;
    const { onSelect, uploadOnDemand, upload } = this.props;

    let index = pickingIndex ?? this.getLastIndex();
    const allowedFiles = this.filterAllowedFiles(files, index);

    allowedFiles.forEach(file => {
      items[index] = { ...defaultFileState, index };
      this.filesToUpload[index] = file;
      this.previewRequests[index] = this.generatePreview(file, index);
      index++;
    });

    onSelect?.(allowedFiles);

    if (upload) this.processUploadOnChange(allowedFiles);
    if (uploadOnDemand) this.processUploadOnDemand();

    if (typeof pickingIndex === 'number') this.store.pickingIndex = null;
  };

  onReorder = ids => {
    const { items } = this.store;
    const { onChange } = this.props;

    this.store.items = ids.map(id => items[id]);

    onChange(null, this.getValFromState());
  };

  onProgress = state => e => {
    Object.assign(state, pick(e, ['total', 'loaded']));
  };

  async generatePreview(file, index) {
    const state = this.store.items[index];

    Object.assign(state, defaultFileState);
    state.base64 = await toBase64(file);

    delete this.previewRequests[index];
  }

  async processUploadOnDemand() {
    await Promise.all(Object.values(this.previewRequests));

    if (!this._mounted) return;

    const { onChange } = this.props;

    onChange(null, this.getValFromState());
  }

  async processUploadOnChange(files) {
    const { onChange } = this.props;
    const { pickingIndex } = this.store;
    const lastIndex = pickingIndex ?? this.getLastIndex();
    const reqs = files.map((file, i) => this.upload(file, lastIndex + i));

    await Promise.all(reqs);

    onChange(null, this.getValFromState());
  }

  async upload(file, index) {
    const { upload } = this.props;
    const { items } = this.store;
    const state = items[index];
    const src = await upload({
      file,
      onProgress: this.onProgress(state),
      getXHR: xhr => (state.xhr = xhr),
    });

    delete this.filesToUpload[index];

    if (!this._mounted) return;

    Object.assign(state, {
      src,
      loaded: state.total,
      xhr: null,
    });
  }

  demandedUploader = async upload => {
    const { value } = this.props;
    const { items } = this.store;
    let newVal;

    if (this.isMultiple()) {
      const requests = [];

      newVal = [...value];
      value.forEach((val, i) => {
        const file = this.filesToUpload[i];

        if (file) {
          const params = { file, onProgress: this.onProgress(items[i]) };
          requests.push(upload(params).then(url => (newVal[i] = url)));
        }
      });

      await Promise.all(requests);
    } else {
      newVal = await upload(this.filesToUpload[0], this.onProgress(items[0]));
    }

    this.filesToUpload = [];

    return newVal;
  };

  remove = async (e, value) => {
    e.stopPropagation();

    const { remove, onChange } = this.props;

    if (remove) {
      const res = await remove(value);
      if (!res) return;
    }

    const { items } = this.store;

    spliceWhere(items, value, 'src');

    onChange(null, this.getValFromState());
  };

  renderPlusButton() {
    const { size } = this.props;

    return (
      <label
        className={cn(S.item, S.addButton)}
        key="add-button"
        onClick={this.onPlusButtonClick}
      >
        <Icon type="plus" size={size} />
      </label>
    );
  }

  renderItem = (i, props = {}) => {
    const { size } = this.props;
    const { base64, src, loaded, total } = this.store.items[i];
    const url = base64 || src;

    return (
      <Item
        {...props}
        size={size}
        key={String(url) + i}
        img={url}
        total={total}
        loaded={loaded}
        waitingForUpload={!!this.filesToUpload[i]}
        onRemove={e => this.remove(e, url)}
        onClick={() => this.onItemClick(i)}
      />
    );
  };

  renderItems() {
    const { draggable, maxCount } = this.props;
    const { items, isDragging } = this.store;

    if (items.length === 0) return this.renderPlusButton();

    const needAddButton = this.isMultiple() && items.length < maxCount;

    if (draggable) {
      const ids = Array.from({ length: items.length }, (_, i) => String(i));

      if (needAddButton) ids.push('add-button');

      return (
        <Draggable
          className={S.draggable}
          itemClassName={S.item}
          items={ids}
          onDragStart={this.onDragStart}
          onDragEnd={this.onDragEnd}
          onChange={this.onReorder}
          renderItem={id =>
            id === 'add-button'
              ? this.renderPlusButton()
              : this.renderItem(parseInt(id, 10), { isDragging })
          }
        />
      );
    }

    const elems = items.map((_, i) =>
      this.renderItem(i, { className: S.item })
    );

    if (needAddButton) elems.push(this.renderPlusButton());

    return elems;
  }

  render() {
    // @ts-ignore
    const { className, size, variant, draggable, label, maxCount, accept } =
      this.props;
    const { labelClipPath, pickingIndex } = this.store;

    const classes = cn(
      S.root,
      className,
      S[`size-${size}`],
      S[`variant-${variant}`],
      draggable && S.draggable
    );

    const scrollOffset = SCROLL_OFFSET[size];

    return (
      <div className={classes}>
        <div
          className={S.border}
          suppressHydrationWarning
          style={{ clipPath: labelClipPath }}
        />

        <input
          ref={this.inputRef}
          className={S.input}
          type="file"
          multiple={maxCount > 1 && typeof pickingIndex !== 'number'}
          accept={accept}
          onChange={this.onChange}
        />

        <Label
          isOnTop
          size={size}
          className={S.label}
          onClipPathChange={clipPath => (this.store.labelClipPath = clipPath)}
        >
          {label}
        </Label>

        <Scroll
          y
          size="s"
          className={S.inner}
          innerClassName={S.items}
          fadeSize={size}
          offset={{ y: { before: scrollOffset, after: scrollOffset } }}
          style={{ clipPath: labelClipPath }}
        >
          {this.renderItems()}
        </Scroll>
      </div>
    );
  }
}

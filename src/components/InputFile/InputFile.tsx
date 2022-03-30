import { ChangeEvent, Component, HTMLProps } from 'react';
import { createStore } from 'justorm/react';
import cn from 'classnames';
import pick from 'lodash.pick';
import compare from 'compareq';

import { Label, Icon, Scroll, file as _file } from 'uilib';

import S from './InputFile.styl';
import Item from './Item/Item';
import { array } from 'uilib/tools';

type ProgressParams = {
  loaded: number;
  total: number;
};

type Value = string[];

type ItemStatus = {
  total: number;
  loaded: number;
};

type Props = {
  className?: string;
  label?: string;
  size?: string;
  upload: (
    file: File,
    onProgress: (params: ProgressParams) => void,
    getXHR?: (xhr: XMLHttpRequest) => void
  ) => Promise<string>;
  uploadStatus?: ItemStatus[];
  rootUrl: string; // folder in cloud storage
  accept?: HTMLProps<HTMLInputElement>['accept'];
  limit?: number; // megabytes
  maxCount?: number; // max files count
  value?: Value; // url
  onSelect?: (e: ChangeEvent<HTMLInputElement>) => void;
  onChange: (e: ChangeEvent<HTMLInputElement>, value: Value) => void; // upload complete
  onFilesCoose?: (files: File[]) => void;
  remove?: (fileName: string) => Promise<boolean>;
};

export type InputFileProps = Props;

const defaultFileState = {
  total: 1,
  loaded: 0,
  error: null,
  base64: '',
};

function stateFromProps(value, maxCount, loaded = 1) {
  return value.slice(0, maxCount).map((src, index) => ({
    ...defaultFileState,
    loaded,
    index,
    src,
  }));
}

export class InputFile extends Component<Props> {
  store;
  _mounted = false;
  files = [];

  constructor(props) {
    super(props);

    this.store = createStore(this, {
      items: this.getStateFromProps(),
      labelClipPath: '',
    });
  }

  static defaultProps = { rootUrl: '', size: 'm', maxCount: 1 };

  componentDidMount() {
    this._mounted = true;
  }

  componentWillUnmount() {
    this._mounted = false;
    this.store.items.forEach(({ xhr }) => xhr?.abort());
  }

  componentDidUpdate(prevProps) {
    const { value, maxCount, uploadStatus } = this.props;
    const { items } = this.store;

    if (!compare(prevProps.value, value) || prevProps.maxCount !== maxCount) {
      this.store.items = this.getStateFromProps();
    }

    if (!compare(prevProps.uploadStatus, uploadStatus)) {
      this.store.items = items.map((itemState, i) => ({
        ...itemState,
        ...uploadStatus[i],
      }));
    }
  }

  getStateFromProps() {
    const { value, maxCount, upload } = this.props;
    const loaded = upload ? 1 : 0;

    return value.slice(0, maxCount).map((src, index) => ({
      ...defaultFileState,
      loaded,
      index,
      src,
    }));
  }

  onChange = async e => {
    const { files } = e.target;
    const { value, maxCount, limit, onChange, onFilesCoose, upload } =
      this.props;
    const { items } = this.store;
    let index = value.length;

    const requests = [];
    const filesByIndex = [];

    [...files].every(file => {
      if (index >= maxCount) return false;

      if (limit) {
        const sizeMb = file.size / 1024 / 1024;

        if (sizeMb > limit) {
          console.error(`Max file size - ${limit}Mb`, file);
          return false;
        }
      }

      items.push({ ...defaultFileState, index });

      if (upload) {
        requests.push(this.upload(file, items[index]));
      } else {
        filesByIndex[index] = file;
      }

      index++;

      return true;
    });

    if (upload) {
      await Promise.all(requests);
      const newValue = [...this.props.value];

      requests.forEach((r, _i) => {
        const i = value.length + _i;
        newValue[i] = items[i].src;
      });

      onChange(null, newValue);
    } else {
      onFilesCoose?.(filesByIndex);
    }
  };

  onProgress = state => e => {
    Object.assign(state, pick(e, ['total', 'loaded']));
  };

  async upload(file, state) {
    const { upload } = this.props;

    Object.assign(state, defaultFileState);

    state.base64 = await _file.toBase64(file);

    const src = await upload(
      file,
      this.onProgress(state),
      xhr => (state.xhr = xhr)
    );

    if (!this._mounted) return;

    Object.assign(state, { src, loaded: state.total, xhr: null });
  }

  remove = async value => {
    const { remove, onChange } = this.props;

    if (remove) {
      const res = await remove(value);
      if (!res) return;
    }

    const { items } = this.store;

    array.spliceWhere(items, value, 'src');

    onChange(
      null,
      items.map(({ src }) => src)
    );
  };

  render() {
    const { className, size, label, accept, maxCount } = this.props;
    const { items, labelClipPath } = this.store;

    const classes = cn(S.root, className, S[`size-${size}`]);

    return (
      <div className={classes}>
        <div className={S.border} style={{ clipPath: labelClipPath }} />

        <Label
          isOnTop
          size={size}
          className={S.label}
          onClipPathChange={clipPath => (this.store.labelClipPath = clipPath)}
        >
          {label}
        </Label>

        <Scroll x size="s" innerClassName={S.items}>
          {items.map(({ base64, src, loaded, total }, i) => {
            const url = base64 || src;

            return (
              <Item
                key={String(url) + i}
                className={S.item}
                img={url}
                loaded={loaded}
                total={total}
                onRemove={() => this.remove(url)}
              />
            );
          })}

          {items.length < maxCount && (
            <label className={cn(S.item, S.addButton)} key="add-button">
              <Icon type="plus" />
              <input
                className={S.input}
                type="file"
                multiple
                accept={accept}
                onChange={this.onChange}
              />
            </label>
          )}
        </Scroll>
      </div>
    );
  }
}

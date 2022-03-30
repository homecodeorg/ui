import { ChangeEvent, Component, HTMLProps } from 'react';
import { createStore } from 'justorm/react';
import cn from 'classnames';
import pick from 'lodash.pick';
import compare from 'compareq';

import { Label, Icon, Scroll, file as fileTools } from 'uilib';

import S from './InputFile.styl';
import Item from './Item/Item';
import { array } from 'uilib/tools';

type ProgressParams = {
  loaded: number;
  total: number;
};
type OnProgress = (args: ProgressParams) => void;
type Uploader = (
  file: File,
  fn: OnProgress,
  getXHR?: (xhr: XMLHttpRequest) => void
) => Promise<string>;

type Value = string[];

type Props = {
  className?: string;
  label?: string;
  size?: string;
  upload: Uploader;
  uploadOnDemand?: (upload: (fn: Uploader) => Promise<Value>) => void;
  rootUrl: string; // folder in cloud storage
  accept?: HTMLProps<HTMLInputElement>['accept'];
  limit?: number; // megabytes
  maxCount?: number; // max files count
  value?: Value; // url
  onSelect?: (e: ChangeEvent<HTMLInputElement>) => void;
  onChange: (e: ChangeEvent<HTMLInputElement>, value: Value) => void; // upload complete
  remove?: (fileName: string) => Promise<boolean>;
};

export type InputFileProps = Props;

let filesToUpload = []; // [File,...]
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
    const { value, maxCount, limit, onChange, uploadOnDemand, upload } =
      this.props;
    const { items } = this.store;
    let index = value.length;

    const requests = [];

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
      }

      if (uploadOnDemand) {
        filesToUpload[index] = file;
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
    }

    if (uploadOnDemand) {
      const vals = [...value];
      const requests = {};

      filesToUpload.forEach((item, i) => {
        if (!item) return;
        requests[i] = fileTools.toBase64(item).then(src => (vals[i] = src));
      });

      await Promise.all(Object.values(requests));

      onChange(null, vals);
    }
  };

  onProgress = state => e => {
    Object.assign(state, pick(e, ['total', 'loaded']));
  };

  async upload(file, state) {
    const { upload } = this.props;

    Object.assign(state, defaultFileState);

    state.base64 = await fileTools.toBase64(file);

    const src = await upload(
      file,
      this.onProgress(state),
      xhr => (state.xhr = xhr)
    );

    if (!this._mounted) return;

    Object.assign(state, { src, loaded: state.total, xhr: null });
  }

  demandedUploader = async upload => {
    const { value } = this.props;
    const { items } = this.store;
    const requests = [];
    const newVal = [...value];

    value.forEach((val, i) => {
      const file = filesToUpload[i];

      if (file) {
        console.log('files[i]', i, file);
        requests.push(
          upload(file, this.onProgress(items[i])).then(url => (newVal[i] = url))
        );
      }
    });

    await Promise.all(requests);

    filesToUpload = [];

    return newVal;
  };

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
                total={total}
                loaded={loaded}
                waitingForUpload={!!filesToUpload[i]}
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

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

type Props = {
  className?: string;
  label?: string;
  size?: string;
  upload: (
    file: File,
    onProgress: (params: ProgressParams) => void,
    getXHR?: (xhr: XMLHttpRequest) => void
  ) => Promise<string>;
  rootUrl: string; // folder in cloud storage
  accept?: HTMLProps<HTMLInputElement>['accept'];
  limit?: number; // megabytes
  maxCount?: number; // max files count
  value?: Value; // url
  onSelect?: (e: ChangeEvent<HTMLInputElement>) => void;
  onChange: (e: ChangeEvent<HTMLInputElement>, value: Value) => void; // upload complete
  remove?: (fileName: string) => Promise<boolean>;
};

const defaultFileState = {
  total: 1,
  loaded: 0,
  error: null,
  base64: '',
};

function stateFromProps(value, maxCount) {
  return value.slice(0, maxCount).map((src, index) => ({
    ...defaultFileState,
    loaded: 1,
    index,
    src,
  }));
}

export class InputFile extends Component<Props> {
  store;
  _mounted = false;

  constructor(props) {
    super(props);

    const { value, maxCount } = props;
    const items = stateFromProps(value, maxCount);

    this.store = createStore(this, { items, labelClipPath: '' });
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
    const { value, maxCount } = this.props;

    if (!compare(prevProps.value, value) || prevProps.maxCount !== maxCount) {
      this.store.items = stateFromProps(value, maxCount);
    }
  }

  onChange = async e => {
    const { files } = e.target;
    const { value, maxCount, limit, onChange } = this.props;
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
      requests.push(this.upload(file, items[index]));
      index++;

      return true;
    });

    await Promise.all(requests);

    const newValue = [...this.props.value];

    requests.forEach((r, _i) => {
      const i = value.length + _i;
      newValue[i] = items[i].src;
    });

    onChange(null, newValue);
  };

  onProgress = state => e => {
    Object.assign(state, pick(e, ['total', 'loaded']));
  };

  async upload(file, state) {
    const { upload, onChange } = this.props;

    Object.assign(state, defaultFileState);

    const str = await _file.toBase64(file);
    state.base64 = str;

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
    const { className, size, label, accept, value, maxCount } = this.props;
    const { items, labelClipPath } = this.store;

    const classes = cn(S.root, className, S[`size-${size}`]);

    return (
      <div className={classes}>
        <div className={S.border} style={{ clipPath: labelClipPath }} />

        <Label
          isOnTop
          className={S.label}
          onClipPathChange={clipPath => (this.store.labelClipPath = clipPath)}
        >
          {label}
        </Label>

        <Scroll x size="s" innerClassName={S.items}>
          {items.map(({ base64, src, loaded, total }) => {
            const url = base64 || src;

            return (
              <Item
                key={url}
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

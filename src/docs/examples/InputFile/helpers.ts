import { file as _file } from 'uilib';

const defaultState = { total: 1000, loaded: 0 };
const simulateLoader = (onProgress, onComplete) => {
  const state = {
    ...defaultState,
    run() {
      this.loaded += 250;
      onProgress({ total: this.total, loaded: this.loaded });
      if (this.loaded === this.total) onComplete();
      else setTimeout(() => this.run(), 400 + Math.random() * 1000);
    },
  };

  state.run();
  return state;
};

const getOnComplete = (file, resolve) => () =>
  _file.toBase64(file).then(resolve);

export const upload = (file, onProgress) =>
  new Promise(resolve => {
    simulateLoader(onProgress, getOnComplete(file, resolve));
  });

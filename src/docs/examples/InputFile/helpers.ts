import { file as _file } from 'uilib';

const defaultState = { total: 1000, loaded: 0 };
const simulateLoader = (onProgress, onComplete) => {
  const state = {
    ...defaultState,
    run() {
      console.log('run', this.loaded);

      this.loaded += 250;
      onProgress({ total: this.total, loaded: this.loaded });
      if (this.loaded === this.total) onComplete();
      else setTimeout(() => this.run(), 400);
    },
    // reset() {
    //   Object.assign(this, defaultState);
    // },
  };

  state.run();
  return state;
};

function getOnComplete(file, resolve) {
  return async () => {
    const src = await _file.toBase64(file);
    resolve(src);
  };
}

export const upload = (file, onProgress) =>
  new Promise(resolve => {
    simulateLoader(onProgress, getOnComplete(file, resolve));
  });

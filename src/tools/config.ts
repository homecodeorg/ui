type Config = {
  appRootId: string;
  appOverlayId: string;
};

export const config = {
  appRootId: 'app-root',
  appOverlayId: 'app-modal',
  configure(params: Config) {
    Object.assign(this, params);
  },
};

import { Component } from 'preact';
import addons from '@storybook/addons';
import { addDecorator } from '@storybook/preact';
import { createStore } from 'justorm/preact';

import Theme from 'babel-loader!./theme';

const channel = addons.getChannel();
const THEME_CONFIG = {
  light: {
    '--accent-color': 'rgba(0,0,0,.7)',
    '--accent-color-light': 'rgba(0,0,0,.3)',
    '--bg-color': 'rgba(255,255,255,.9)',
    '--bg-color-light': 'rgba(255,255,255,.3)',
    '--active-color': '#ffd37e',
    '--active-color-light': 'rgba(255, 211, 126, .5)',
    '--active-text-color': 'rgba(0,0,0,.9)',
  },
  dark: {
    '--accent-color': 'rgba(255,255,255,.7)',
    '--accent-color-light': 'rgba(255,255,255,.3)',
    '--bg-color': 'rgba(0,0,0,.9)',
    '--bg-color-light': 'rgba(0,0,0,.3)',
    '--active-color': '#ffd37e',
    '--active-color-light': 'rgba(255, 211, 126, .5)',
    '--active-text-color': 'rgba(0,0,0,.9)',
  },
};

class ThemeWrapper extends Component {
  store;

  constructor(props) {
    super(props);
    this.store = createStore(this, { isDark: false });
  }

  componentDidMount() {
    channel.on('DARK_MODE', this.setDark);
  }

  componentWillUnmount() {
    channel.off('DARK_MODE', this.setDark);
  }

  setDark = isDark => {
    this.store.isDark = isDark;
  };

  render({ children }) {
    const themeConfig = THEME_CONFIG[this.store.isDark ? 'dark' : 'light'];

    return [<Theme config={themeConfig} />, children];
  }
}

addDecorator(renderStory => <ThemeWrapper>{renderStory()}</ThemeWrapper>);

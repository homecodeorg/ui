import { hot } from 'react-hot-loader/root';
import { Component, createRef } from 'react';
import { withStore } from 'justorm/react';
import cn from 'classnames';
import { Router, Lazy, Button, Theme } from 'uilib';

import { watchControllerFlag } from 'uilib/tools/dom';

import Sidebar from '../Sidebar/Sidebar';
import NAV_CONFIG from '../../navigation';
require('./store');
import S from './App.styl';

watchControllerFlag();

@withStore('app')
class App extends Component<{ store?: any }> {
  colorPickerRef = createRef<HTMLInputElement>();

  store;

  constructor(props) {
    super(props);
    this.store = props.store.app;
  }

  isDarkTheme = () => this.store.theme === 'dark';

  toggleTheme = () => {
    this.store.setTheme(this.isDarkTheme() ? 'light' : 'dark');
  };

  setActiveColor = color => {
    this.store.activeColor = color;
  };

  // @ts-ignore
  pickActiveColor = () => this.colorPickerRef.current.click();

  render() {
    const { currThemeConfig, activeColor } = this.store;

    return (
      <>
        <div className={S.root}>
          <div className={S.nav}>
            <div className={S.configBar}>
              <Button
                className={S.cfgButton}
                variant="clear"
                size="l"
                isSquare
                onClick={this.toggleTheme}
              >
                {this.isDarkTheme() ? '🌙' : '🌕'}
              </Button>

              <Button
                className={S.cfgButton}
                variant="clear"
                size="l"
                isSquare
                onClick={this.pickActiveColor}
              >
                <div className={S.activeColor} />
                <input
                  type="color"
                  ref={this.colorPickerRef}
                  className={S.colorPicker}
                  onChange={this.setActiveColor}
                  value={activeColor}
                />
              </Button>
            </div>

            <Sidebar />
          </div>

          <div className={S.content}>
            <Router>
              {NAV_CONFIG.map(({ slug, loader }) => (
                // @ts-ignore
                <Lazy path={`/${slug}`} loader={loader} key={slug} />
              ))}
            </Router>
          </div>
        </div>

        <Theme config={currThemeConfig.originalObject} />
      </>
    );
  }
}

export default hot(App);

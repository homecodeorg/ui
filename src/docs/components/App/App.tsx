import { hot } from 'react-hot-loader/root';
import { Component, createRef } from 'react';
import { withStore } from 'justorm/react';
import cn from 'classnames';
import { Router, Lazy, Button, Theme, dom, Icon } from 'uilib';

import Sidebar from '../Sidebar/Sidebar';
import NAV_CONFIG from '../../navigation';
require('./store');
import S from './App.styl';
import { Container, Paranja } from 'uilib/components';

dom.watchControllerFlag();

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

  toggleMenu = () => (this.store.isMenuOpen = !this.store.isMenuOpen);

  // @ts-ignore
  pickActiveColor = () => this.colorPickerRef.current.click();

  render() {
    const { currThemeConfig, activeColor, isMenuOpen } = this.store;

    return (
      <>
        <div className={S.root}>
          <div className={cn(S.nav, isMenuOpen && S.open)}>
            <Button
              className={S.menuButton}
              variant="clear"
              size="l"
              onClick={this.toggleMenu}
            >
              <Icon type="menu" size="l" />
            </Button>
            <div className={S.configBar}>
              <span className={S.version}>v{VERSION}</span>
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
                  onChange={e => this.store.setActiveColor(e.target.value)}
                  value={activeColor}
                />
              </Button>
            </div>
            <Sidebar />
          </div>

          <Container size="xl" fullWidth className={S.content}>
            <Router>
              {NAV_CONFIG.map(({ slug, loader }) => (
                // @ts-ignore
                <Lazy path={`/${slug}`} loader={loader} key={slug} />
              ))}
            </Router>
          </Container>
        </div>

        <Theme config={currThemeConfig.originalObject} />
      </>
    );
  }
}

export default hot(App);

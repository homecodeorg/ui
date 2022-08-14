import { hot } from 'react-hot-loader/root';
import { Component, createRef } from 'react';
import { withStore } from 'justorm/react';
import cn from 'classnames';
import {
  Router,
  Redirect,
  Lazy,
  Button,
  Theme,
  dom,
  Icon,
  Container,
} from 'uilib';

import Sidebar from '../components/Sidebar/Sidebar';
import NAV_CONFIG from '../navigation';

require('./store');
import S from './App.styl';

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

  // @ts-ignore
  pickActiveColor = () => this.colorPickerRef.current.click();

  renderItem(groupId, { id, loader }) {
    const path = `/${groupId}/${id}`;

    return (
      // @ts-ignore
      <Lazy exact path={path} loader={loader} key={path} />
    );
  }

  render() {
    const { currThemeConfig, activeColor, isMenuOpen } = this.store;

    return (
      <>
        <Theme config={currThemeConfig.originalObject} />

        <div className={cn(S.root, isMenuOpen && S.isMenuOpen)}>
          <div className={S.nav}>
            <div className={S.configBar}>
              <span className={S.version}>v{VERSION}</span>
              <Button
                className={S.cfgButton}
                variant="clear"
                size="l"
                square
                onClick={this.toggleTheme}
              >
                {this.isDarkTheme() ? '🌙' : '🌕'}
              </Button>

              <Button
                className={S.cfgButton}
                variant="clear"
                size="l"
                square
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

              <div style={{ width: 50 }} />
            </div>
            <Sidebar />
          </div>

          <Container fullWidth className={S.content}>
            <Router>
              <Redirect exact path="/" to="/intro/about" key="/" />
              {NAV_CONFIG.map(({ id, items }) =>
                items.map(item => this.renderItem(id, item))
              )}
            </Router>
          </Container>

          <Button
            className={S.menuButton}
            variant="clear"
            size="l"
            onClick={this.store.toggleMenu}
          >
            <Icon type="menu" size="l" />
          </Button>
        </div>
      </>
    );
  }
}

export default hot(App);

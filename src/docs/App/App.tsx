import { Component, createRef } from 'react';
import { withStore } from 'justorm/react';
import cn from 'classnames';

import {
  Button,
  Container,
  Icon,
  Redirect,
  Router,
  Route,
  Theme,
  Lazy,
  dom,
  VH,
} from 'uilib';

import Sidebar from 'docs/components/Sidebar/Sidebar';
import NAV_CONFIG from 'docs/navigation';

import './store';
import S from './App.styl';

dom.watchControllerFlag();

@withStore('app')
class App extends Component<{ store?: any }> {
  colorPickerRef = createRef<HTMLInputElement>();

  // @ts-ignore
  pickActiveColor = () => this.colorPickerRef.current.click();

  renderItem(groupId, { id, loader }) {
    const path = `/${groupId}/${id}`;

    return (
      // @ts-ignore
      <Route path={path} component={Lazy} loader={loader} key={path} />
    );
  }

  render() {
    const { app } = this.props.store;
    const { currThemeConfig, activeColor, isMenuOpen } = app;

    return (
      <>
        <VH />
        <Theme config={currThemeConfig.originalObject} />

        <div className={cn(S.root, isMenuOpen && S.isMenuOpen)}>
          <div className={S.nav}>
            <div className={S.configBar}>
              {/* @ts-ignore */}
              <span className={S.version}>v{VERSION}</span>
              <Button
                className={S.cfgButton}
                variant="clear"
                size="l"
                square
                onClick={app.toggleTheme}
              >
                {app.isDarkTheme() ? '🌙' : '🌕'}
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
                  onChange={e => app.setActiveColor(e.target.value)}
                  value={activeColor}
                />
              </Button>

              <div className={S.cfgBarMenuButtonPlaceholder} />
            </div>
            <Sidebar />
          </div>

          <Container fullWidth className={S.content}>
            <Router single>
              {/* @ts-ignore */}
              <Route
                component={Redirect}
                exact
                path="/"
                to="/intro/about"
                key="/"
              />
              {NAV_CONFIG.map(({ id, items }) =>
                items.map(item => this.renderItem(id, item))
              )}
            </Router>
          </Container>

          <Button
            className={S.menuButton}
            variant="clear"
            size="l"
            onClick={app.toggleMenu}
          >
            <Icon type="menu" size="l" />
          </Button>
        </div>
      </>
    );
  }
}

export default App;

import { useRef } from 'react';
import { useStore } from 'justorm/react';
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
  LazyProps,
  dom,
  VH,
} from 'uilib';

import Sidebar from 'docs/components/Sidebar/Sidebar';
import NAV_CONFIG from 'docs/navigation';

import './store';
import S from './App.styl';

dom.watchControllerFlag();

const App = () => {
  const colorPickerRef = useRef<HTMLInputElement>(null);
  const { app } = useStore({
    app: ['currThemeConfig', 'activeColor', 'isMenuOpen'],
  });
  const { currThemeConfig, activeColor, isMenuOpen } = app;

  const pickActiveColor = () => colorPickerRef.current?.click();

  const renderItem = (groupId, { id, loader }) => {
    const path = `/${groupId}/${id}`;
    // @ts-ignore
    return <Route path={path} component={Lazy} loader={loader} key={path} />;
  };

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
              onClick={pickActiveColor}
            >
              <div className={S.activeColor} />
              <input
                type="color"
                ref={colorPickerRef}
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
            <Route
              component={Redirect}
              exact
              path="/"
              to="/intro/about"
              key="/"
            />
            {NAV_CONFIG.map(({ id, items }) =>
              items.map(item => renderItem(id, item))
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
};

export default App;

import { Fragment, useCallback } from 'react';
import { createStore, withStore } from 'justorm/preact';

import { capitalize } from '../tools/string';
import { watchControllerFlag } from '../tools/dom';

import { Router, Link } from '../components/Router/Router';
import Lazy from '../components/Lazy/Lazy';
import { Button } from '../components/Button/Button';
import { Theme } from '../components/Theme/Theme';

import THEME_CONFIG from './theme';
import NAV_CONFIG from './navigation';
import S from './App.styl';

const initialThemeType = localStorage.getItem('theme') ?? 'dark';

createStore('app', {
  theme: initialThemeType,
  activeColor:
    localStorage.getItem('activeColor') ??
    THEME_CONFIG[initialThemeType].active,
});
watchControllerFlag();

export default withStore('app')(function App({ store }) {
  const { theme, activeColor } = store.app;
  const isDark = theme === 'dark';

  const toggleTheme = useCallback(() => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    store.app.theme = nextTheme;
    localStorage.setItem('theme', nextTheme);
  }, [theme]);

  // TODO: use ColorPicker from lib
  // const pickActiveColor = useCallback(() => {
  //   const nextActiveColor = theme === 'dark' ? 'light' : 'dark';
  //   store.app.theme = nextActiveColor;
  //   localStorage.setItem('activeColor', nextActiveColor);
  // }, [activeColor]);

  const themeConfig = { ...THEME_CONFIG[theme], active: activeColor };

  return (
    <Fragment>
      <div className={S.root}>
        <div className={S.nav}>
          <div className={S.configBar}>
            <Button
              className={S.cfgButton}
              variant="clear"
              size="l"
              isSquare
              onClick={toggleTheme}
            >
              {isDark ? '🌙' : '🌕'}
            </Button>

            {/*<Button
              className={S.cfgButton}
              variant="clear"
              size="l"
              isSquare
              onClick={toggleTheme}
              style={{ backgroundColor: activeColor }}
            ></Button>*/}
          </div>

          {NAV_CONFIG.map(({ name }) => (
            <div className={S.navItem}>
              <Link href={`/${name}`} key={name}>
                {capitalize(name)}
              </Link>
            </div>
          ))}
        </div>
        <div className={S.content}>
          <Router>
            {NAV_CONFIG.map(({ name, loader }) => (
              <Lazy path={`/${name}`} loader={loader} key={name} />
            ))}
          </Router>
        </div>
      </div>

      <Theme config={themeConfig} />
    </Fragment>
  );
});

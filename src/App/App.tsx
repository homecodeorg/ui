import { Fragment, useCallback, useRef } from 'react';
import { createStore, withStore } from 'justorm/preact';
import cn from 'classnames';

import { capitalize } from '../tools/string';
import { watchControllerFlag } from '../tools/dom';

import { Router, Link } from '../components/Router/Router';
import Lazy from '../components/Lazy/Lazy';
import { Button } from '../components/Button/Button';
import { Theme, ThemeHelpers } from '../components/Theme/Theme';

import { config as themeConfig, colors } from './theme';
import NAV_CONFIG from './navigation';
import S from './App.styl';

const initialThemeType = localStorage.getItem('theme') ?? 'dark';

createStore('app', {
  theme: initialThemeType,
  activeColor:
    localStorage.getItem('activeColor') ??
    themeConfig[initialThemeType]['active-color'],
});
watchControllerFlag();

export default withStore('app')(function App({ store }) {
  const { theme, activeColor } = store.app;
  const isDark = theme === 'dark';

  const colorPicker = useRef();

  const toggleTheme = useCallback(() => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    store.app.theme = nextTheme;
    localStorage.setItem('theme', nextTheme);
  }, [theme]);

  const pickActiveColor = useCallback(() => {
    colorPicker.current.click();
  }, []);
  const setActiveColor = useCallback(e => {
    const color = e.target.value;
    store.app.activeColor = color;
    localStorage.setItem('activeColor', color);
  }, []);

  const currThemeConfig = {
    ...themeConfig[theme],
    ...ThemeHelpers.colorsConfigToVars({
      active: [activeColor, colors.active[1]],
    }),
  };

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

            <Button
              className={S.cfgButton}
              variant="clear"
              size="l"
              isSquare
              onClick={pickActiveColor}
            >
              <div className={S.activeColor} />
              <input
                type="color"
                ref={colorPicker}
                className={S.colorPicker}
                onChange={setActiveColor}
                value={activeColor}
              />
            </Button>
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

      <Theme config={currThemeConfig} />
    </Fragment>
  );
});

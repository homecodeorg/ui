import { Fragment } from 'preact';
import { createStore, withStore } from 'justorm/preact';

import { capitalize } from 'tools/string';

import Theme from 'components/UI/Theme/Theme';
import Router, { Link } from 'components/Router/Router';
import Lazy from 'components/Lazy/Lazy';

import NAV_CONFIG from './navigation';
import THEME_CONFIG from './theme';
import S from './App.styl';

createStore('app', { theme: THEME_CONFIG.light });

export default withStore({ app: ['theme'] })(function App({ store }) {
  return (
    <Fragment>
      <div className={S.root}>
        <div className={S.nav}>
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
              <Lazy path={`/${name}`} loading={loader} key={name} />
            ))}
          </Router>
        </div>
      </div>
      <Theme config={store.app.theme} />
    </Fragment>
  );
});

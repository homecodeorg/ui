import { Fragment } from 'react';

import { capitalize } from '../tools/string';
import { watchControllerFlag } from '../tools/dom';

import { Router, Link } from '../components/Router/Router';
import Lazy from '../components/Lazy/Lazy';

import Theme from './Theme';
import NAV_CONFIG from './navigation';
import S from './App.styl';

watchControllerFlag();

export default function App() {
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
      <Theme />
    </Fragment>
  );
}

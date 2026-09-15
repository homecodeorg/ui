import './store';

import {
  Button,
  Container,
  Icon,
  Input,
  Lazy,
  Redirect,
  Route,
  Router,
  VH,
  dom,
  useTheme,
} from 'uilib';
import { useCallback, useEffect, useRef, useState } from 'react';

import NAV_CONFIG from 'docs/navigation';
import S from './App.styl';
import { SearchIcon } from 'lucide-react';
import Sidebar from 'docs/components/Sidebar/Sidebar';
import cn from 'classnames';
import { useStore } from 'justorm/react';

dom.watchControllerFlag();

const App = () => {
  const colorPickerRef = useRef<HTMLInputElement>(null);
  const searchInputRef = useRef(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { app } = useStore({
    app: ['isMenuOpen'],
  });
  const { isMenuOpen } = app;
  const { activeColor, isDarkTheme, toggleTheme, setActiveColor } = useTheme();

  const pickActiveColor = () => colorPickerRef.current?.click();

  const closeSearch = useCallback(() => {
    setIsSearching(false);
    setSearchQuery('');
  }, []);

  const toggleSearch = useCallback(() => {
    setIsSearching(open => {
      if (open) setSearchQuery('');
      return !open;
    });
  }, []);

  useEffect(() => {
    if (!isSearching) return;

    searchInputRef.current?.focus?.();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeSearch();
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isSearching, closeSearch]);

  const renderItem = (groupId, { id, loader }) => {
    const path = `/${groupId}/${id}`;
    // @ts-ignore
    return <Route path={path} component={Lazy} loader={loader} key={path} />;
  };

  return (
    <>
      <VH />
      <div className={cn(S.root, isMenuOpen && S.isMenuOpen)}>
        <div className={S.nav}>
          <div className={S.configBar}>
            <div className={S.configBarMain}>
              {/* @ts-ignore */}
              <span className={S.version}>v{VERSION}</span>
              <Button
                className={S.cfgButton}
                variant="clear"
                size="l"
                square
                onClick={toggleTheme}
              >
                {isDarkTheme ? '🌙' : '🌕'}
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
                  onChange={e => setActiveColor(e.target.value)}
                  value={activeColor}
                />
              </Button>
              <Button
                className={S.cfgButton}
                variant="text"
                size="l"
                square
                onClick={toggleSearch}
              >
                <SearchIcon size={22} />
              </Button>
              <div className={S.cfgBarMenuButtonPlaceholder} />
            </div>
            {isSearching && (
              <Input
                ref={searchInputRef}
                className={S.searchInput}
                variant="clean"
                placeholder="Search..."
                size="s"
                value={searchQuery}
                onChange={(e, val) => setSearchQuery(String(val ?? ''))}
              />
            )}
          </div>
          <Sidebar searchQuery={isSearching ? searchQuery : ''} />
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

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDebouncedCallback } from 'use-debounce';
import { MdSettings, MdClose } from 'react-icons/md';
import { ANIMATE, ROUTES } from 'appConstants';
import Dock from 'react-dock';

import logo from 'assets/images/logos/logo-dark-icon.svg';
import { getStyleApplicationFn } from 'utils/style';
import { DOCK_PANEL_STYLE } from 'styles/dock';
import style from './search-bar.css';

const DOCK_WIDTH = 225;

const s = getStyleApplicationFn(style);

const SearchBar = ({
  onlyShowSearchBar,
  searchText,
  toggleSearchBar,
  toggleDock,
  updateAskSearchText,
  minimizeSearchBar,
  history
}) => {
  const [debouncedOpenExtension] = useDebouncedCallback((query) => {
    if (onlyShowSearchBar && query !== '') {
      toggleSearchBar();
      toggleDock();
      history.push(ROUTES.ASK);
    }
  }, ANIMATE.DEBOUNCE.MS_300);

  useEffect(() => {
    debouncedOpenExtension(searchText);
  }, [searchText, debouncedOpenExtension]);

  return (
    <Dock
      position="right"
      fluid={false}
      dimMode="none"
      size={DOCK_WIDTH}
      zIndex={10000000000}
      isVisible={onlyShowSearchBar}
      dockStyle={{
        ...DOCK_PANEL_STYLE,
        height: 'auto'
      }}
    >
      <div className={s('flex items-center')}>
        {/*
        <div
          className={s(
            'self-stretch px-xs rounded-l-lg bg-purple-reg text-white flex items-center cursor-pointer'
          )}
          onClick={minimizeSearchBar}
        >
          <MdChevronRight />
        </div> */}

        <div className={s('toggle-close-button')} onClick={minimizeSearchBar}>
          <MdClose />
        </div>
        <img src={logo} alt="Omni logo for searchbar" className={s('searchbar-logo ml-sm')} />
        <input
          onChange={(e) => updateAskSearchText(e.target.value)}
          value={searchText}
          placeholder="Search in Omni"
          className={s('flex-1 searchbar-input m-sm')}
        />
        <div className={s('text-gray-reg')}>
          <MdSettings className={s('text-xs mr-xs')} />
        </div>
      </div>
    </Dock>
  );
};

SearchBar.propTypes = {
  // Redux State
  onlyShowSearchBar: PropTypes.bool.isRequired,
  searchText: PropTypes.string.isRequired,

  // Redux Actions
  toggleSearchBar: PropTypes.func.isRequired,
  toggleDock: PropTypes.func.isRequired,
  updateAskSearchText: PropTypes.func.isRequired,
  minimizeSearchBar: PropTypes.func.isRequired
};

export default SearchBar;

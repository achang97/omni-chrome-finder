import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDebouncedCallback } from 'use-debounce';
import { MdSettings, MdClose } from 'react-icons/md';

import { Dock } from 'components/common';
import { ANIMATE, ROUTES, PROFILE, SEGMENT, URL_REGEX } from 'appConstants';

import logo from 'assets/images/logos/logo-dark-icon.svg';
import { getStyleApplicationFn } from 'utils/style';
import style from './search-bar.css';

const DOCK_WIDTH = 225;

const s = getStyleApplicationFn(style);

const regexMatch = URL_REGEX.SEARCH_BAR.find(({ regex }) => window.location.href.match(regex));
const BASE_EVENT_PROPERTIES = {
  type: regexMatch && regexMatch.integration.title
};

const SearchBar = ({
  onlyShowSearchBar,
  searchText,
  toggleSearchBar,
  toggleDock,
  updateAskSearchText,
  minimizeSearchBar,
  trackEvent,
  history
}) => {
  const [isHovering, setIsHovering] = useState(false);

  const [debouncedOpenExtension] = useDebouncedCallback((query) => {
    if (onlyShowSearchBar && query !== '') {
      toggleSearchBar();
      toggleDock();
      trackEvent(SEGMENT.EVENT.SEARCH_IN_SEARCHBAR, { Query: query, ...BASE_EVENT_PROPERTIES });
      history.push(ROUTES.ASK);
    }
  }, ANIMATE.DEBOUNCE.MS_300);

  useEffect(() => {
    debouncedOpenExtension(searchText);
  }, [searchText, debouncedOpenExtension]);

  const openSettings = () => {
    toggleDock();
    trackEvent(SEGMENT.EVENT.CLICK_SEARCHBAR_SETTINGS, BASE_EVENT_PROPERTIES);
    history.push(ROUTES.PROFILE, {
      startOpenSettingsSection: PROFILE.SETTING_SECTION_TYPE.SEARCH_BAR
    });
  };

  const closeSearchBar = () => {
    minimizeSearchBar();
    trackEvent(SEGMENT.EVENT.CLOSE_SEARCHBAR, BASE_EVENT_PROPERTIES);
  };

  return (
    <Dock position="right" width={DOCK_WIDTH} isVisible={onlyShowSearchBar} isFullHeight={false}>
      <div
        className={s('flex items-center')}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {isHovering && (
          <div className={s('close-button')} onClick={closeSearchBar}>
            <MdClose />
          </div>
        )}
        <div onClick={toggleDock} className={s('cursor-pointer')}>
          <img src={logo} alt="Omni logo for searchbar" className={s('searchbar-logo')} />
        </div>
        <input
          onChange={(e) => updateAskSearchText(e.target.value)}
          onClick={() => trackEvent(SEGMENT.EVENT.CLICK_SEARCHBAR_INPUT, BASE_EVENT_PROPERTIES)}
          value={searchText}
          placeholder="Search in Omni"
          className={s('flex-1 searchbar-input m-sm')}
        />
        <div className={s('text-gray-reg cursor-pointer')} onClick={openSettings}>
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
  minimizeSearchBar: PropTypes.func.isRequired,
  trackEvent: PropTypes.func.isRequired
};

export default SearchBar;

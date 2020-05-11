import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDebouncedCallback } from 'use-debounce';
import { MdSearch, MdFilterList } from 'react-icons/md';
import AnimateHeight from 'react-animate-height';

import CardTags from 'components/cards/CardTags';
import { Tabs, Tab, Separator } from 'components/common';
import SuggestionScrollContainer from 'components/suggestions/SuggestionScrollContainer';

import { UserPropTypes } from 'utils/propTypes';
import { getArrayIds } from 'utils/array';
import { usePrevious } from 'utils/react';
import { CARD, NAVIGATE, SEARCH, ANIMATE } from 'appConstants';

import { colors } from 'styles/colors';

import { getStyleApplicationFn } from 'utils/style';
import style from './navigate.css';

const s = getStyleApplicationFn(style);

const Navigate = ({
  searchText,
  activeTab,
  filterTags,
  user,
  cards,
  isSearchingCards,
  hasReachedLimit,
  isDeletingCard,
  deleteError,
  updateNavigateTab,
  updateNavigateSearchText,
  updateFilterTags,
  removeFilterTag,
  clearSearchCards,
  requestDeleteNavigateCard,
  requestSearchCards
}) => {
  const [isFilterShown, setFilterShown] = useState(false);

  useEffect(() => {
    return () => {
      updateNavigateTab(NAVIGATE.TAB_OPTION.ALL);
    };
  }, [updateNavigateTab]);

  const searchCards = (clearCards) => {
    const queryParams = { q: searchText };
    switch (activeTab) {
      case NAVIGATE.TAB_OPTION.ALL: {
        queryParams.tags = getArrayIds(filterTags).join(',');
        break;
      }
      case NAVIGATE.TAB_OPTION.MY_CARDS: {
        queryParams.statuses = Object.values(CARD.STATUS).join(',');
        queryParams.owners = user._id;
        break;
      }
      case NAVIGATE.TAB_OPTION.BOOKMARKED: {
        if (user.bookmarkIds.length === 0) {
          clearSearchCards(SEARCH.TYPE.NAVIGATE);
          return;
        }
        queryParams.statuses = Object.values(CARD.STATUS).join(',');
        queryParams.ids = user.bookmarkIds.join(',');
        break;
      }
      default:
        break;
    }

    requestSearchCards(SEARCH.TYPE.NAVIGATE, queryParams, clearCards);
  };

  const [debouncedRequestSearch] = useDebouncedCallback(() => {
    searchCards(true);
  }, ANIMATE.DEBOUNCE.MS_300);

  const prevTab = usePrevious(activeTab);
  const prevTags = usePrevious(filterTags);

  useEffect(() => {
    if (prevTab !== activeTab || prevTags !== filterTags) {
      searchCards(true);
    } else {
      debouncedRequestSearch();
    }
  }, [activeTab, filterTags, searchText]);

  const updateSearchText = (e) => {
    updateNavigateSearchText(e.target.value);
  };

  const isOnAllCards = activeTab === NAVIGATE.TAB_OPTION.ALL;

  return (
    <div className={s('flex flex-col flex-grow min-h-0')}>
      <Separator horizontal className={s('m-0')} />
      <div className={s('bg-purple-xlight px-sm flex flex-col')}>
        <div className={s('flex items-center my-sm')}>
          <input
            placeholder="Search all knowledge"
            className={s('navigate-search-input')}
            value={searchText}
            autoFocus
            onChange={updateSearchText}
          />
          <div className={s('navigate-search-input-icon-container')}>
            <MdSearch />
          </div>
          <button
            className={s('ml-xs text-gray-light')}
            onClick={() => setFilterShown(!isFilterShown)}
            disabled={!isOnAllCards}
            type="button"
          >
            <MdFilterList />
          </button>
        </div>
        <AnimateHeight height={isOnAllCards && isFilterShown ? 'auto' : 0}>
          <div className={s('my-reg text-xs')}> Filter cards by tags </div>
          <CardTags
            isEditable
            tags={filterTags}
            onChange={updateFilterTags}
            onRemoveClick={removeFilterTag}
            showPlaceholder
            hideSelectOnBlur
          />
        </AnimateHeight>
      </div>
      <div>
        <Tabs
          activeValue={activeTab}
          className={s('flex-1 flex')}
          tabClassName={s(
            'bg-purple-xlight flex flex-col text-xs font-medium flex items-center justify-between opacity-100'
          )}
          activeTabClassName={s('bg-purple-xlight')}
          onTabClick={updateNavigateTab}
          showRipple={false}
          color={colors.purple.reg}
        >
          {NAVIGATE.TAB_OPTIONS.map((navigateTab) => (
            <Tab tabContainerClassName={s('flex-1')} value={navigateTab} key={navigateTab}>
              <div>{navigateTab}</div>
            </Tab>
          ))}
        </Tabs>
      </div>
      <SuggestionScrollContainer
        className={s('min-h-0 flex-1')}
        cards={cards}
        verticalMarginAdjust
        isSearchingCards={isSearchingCards}
        onBottom={() => searchCards(false)}
        hasReachedLimit={hasReachedLimit}
        getCardProps={(card, i) => ({
          showMoreMenu: true,
          deleteProps: {
            onClick: requestDeleteNavigateCard,
            isLoading: isDeletingCard,
            error: deleteError
          },
          className: i === 0 ? 'my-reg' : ''
        })}
      />
    </div>
  );
};

Navigate.propTypes = {
  // Redux State
  searchText: PropTypes.string.isRequired,
  activeTab: PropTypes.oneOf(NAVIGATE.TAB_OPTIONS).isRequired,
  filterTags: PropTypes.arrayOf(PropTypes.object).isRequired,
  user: UserPropTypes.isRequired,
  cards: PropTypes.arrayOf(PropTypes.object).isRequired,
  isSearchingCards: PropTypes.bool,
  hasReachedLimit: PropTypes.bool.isRequired,
  isDeletingCard: PropTypes.bool,
  deleteError: PropTypes.string,

  // Redux Actions
  updateNavigateTab: PropTypes.func.isRequired,
  updateNavigateSearchText: PropTypes.func.isRequired,
  updateFilterTags: PropTypes.func.isRequired,
  removeFilterTag: PropTypes.func.isRequired,
  clearSearchCards: PropTypes.func.isRequired,
  requestDeleteNavigateCard: PropTypes.func.isRequired,
  requestSearchCards: PropTypes.func.isRequired
};

export default Navigate;

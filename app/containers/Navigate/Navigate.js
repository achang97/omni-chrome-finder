import React, { useEffect, useRef } from 'react';
import _ from 'lodash';
import { MdSearch } from 'react-icons/md';
import AnimateHeight from 'react-animate-height';

import CardTags from 'components/cards/CardTags';
import { Tabs, Tab, Separator, Loader, Button } from 'components/common';
import SuggestionScrollContainer from 'components/suggestions/SuggestionScrollContainer';

import { getArrayIds } from 'utils/array';
import { usePrevious } from 'utils/react';
import { CARD, NAVIGATE, SEARCH, ANIMATE } from 'appConstants';

import { colors } from 'styles/colors';

import style from './navigate.css';
import { getStyleApplicationFn } from 'utils/style';
const s = getStyleApplicationFn(style);

const Navigate = ({
  searchText, activeTab, filterTags, user,
  cards, isSearchingCards, hasReachedLimit,
  isDeletingCard, deleteError,
  updateNavigateTab, updateNavigateSearchText, updateFilterTags, removeFilterTag, clearSearchCards,
  requestDeleteNavigateCard, requestSearchCards,
}) => {
  const isInitialMount = useRef(true);

  useEffect(() => {
    return () => {
      updateNavigateTab(NAVIGATE.TAB_OPTION.ALL);
    }
  }, [])

  const prevTab = usePrevious(activeTab);
  const prevTags = usePrevious(filterTags); 

  useEffect(() => {
    if (prevTab !== activeTab || prevTags !== filterTags) {
      searchCards(true);
    } else {
      debouncedRequestSearch();
    }
  }, [activeTab, filterTags, searchText])


  const searchCards = (clearCards) => {
    const queryParams = { q: searchText };
    switch (activeTab) {
      case NAVIGATE.TAB_OPTION.ALL: {
        queryParams.tags = getArrayIds(filterTags).join(",");
        break;
      }
      case NAVIGATE.TAB_OPTION.MY_CARDS: {
        queryParams.statuses = Object.values(CARD.STATUS).join(",");
        queryParams.owners = user._id;
        break;
      }
      case NAVIGATE.TAB_OPTION.BOOKMARKED: {
        if (user.bookmarkIds.length === 0) {
          clearSearchCards(SEARCH.TYPE.NAVIGATE);
          return;
        } 
        queryParams.statuses = Object.values(CARD.STATUS).join(",");
        queryParams.ids = user.bookmarkIds.join(",");
        break;
      }
    }

    requestSearchCards(SEARCH.TYPE.NAVIGATE, queryParams, clearCards);
  }

  const debouncedRequestSearch = _.debounce(() => {
    searchCards(true);
  }, ANIMATE.DEBOUNCE.HZ_60)

  const updateSearchText = (e) => {
    updateNavigateSearchText(e.target.value);
  }

  return (
    <div className={s('flex flex-col flex-grow min-h-0')}>
      <Separator horizontal className={s('m-0')} />
      <div className={s('bg-purple-xlight p-lg flex flex-col')}>
        <div className={s('flex')}>
          <input
            placeholder="Search all knowledge"
            className={s('navigate-search-input flex-grow rounded-r-none border-r-none')}
            value={searchText}
            autoFocus
            onChange={updateSearchText}
          />
          <div className={s('navigate-search-input-icon-container bg-white flex flex-col items-center justify-center text-purple-reg rounded-r-lg pr-reg')}> <MdSearch /> </div>
        </div>
        <AnimateHeight height={activeTab === NAVIGATE.TAB_OPTION.ALL ? 'auto' : 0}>
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
          tabClassName={s('bg-purple-xlight flex flex-col text-xs font-medium flex items-center justify-between opacity-100')}
          activeTabClassName={s('bg-purple-xlight')}
          onTabClick={updateNavigateTab}
          showRipple={false}
          color={colors.purple.reg}
        >
          {
            NAVIGATE.TAB_OPTIONS.map(navigateTab => (
              <Tab tabContainerClassName={s('flex-1')} value={navigateTab} key={navigateTab}>
                <div>{navigateTab}</div>
              </Tab>
            ))
          }
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
            error: deleteError,
          },
          className: i === 0 ? 'my-reg' : ''
        })}
      />
    </div>
  );
}

export default Navigate;
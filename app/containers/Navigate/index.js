import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { MdSearch } from 'react-icons/md';

import * as navigateActions from '../../actions/navigate';
import { requestSearchCards, clearSearchCards } from '../../actions/search';

import CardTags from '../../components/cards/CardTags';
import AnimateHeight from 'react-animate-height';
import Tabs from '../../components/common/Tabs/Tabs';
import Tab from '../../components/common/Tabs/Tab';
import { colors } from '../../styles/colors';

import Loader from '../../components/common/Loader';
import SuggestionScrollContainer from '../../components/suggestions/SuggestionScrollContainer';
import Button from '../../components/common/Button';
import _ from 'lodash';

import { getArrayIds } from '../../utils/array';
import { CARD_STATUS, SEARCH_INFINITE_SCROLL_OFFSET, NAVIGATE_TAB_OPTION, NAVIGATE_TAB_OPTIONS, SEARCH_TYPE, DEBOUNCE_60_HZ } from '../../utils/constants';

import style from './navigate.css';
import { getStyleApplicationFn } from '../../utils/style';
const s = getStyleApplicationFn(style);

class Navigate extends Component {
  componentDidMount() {
    this.requestSearchCards(true);
  }

  componentDidUpdate(prevProps) {
    const { updateNavigateSearchText, updateFilterTags, searchText } = this.props;

    if (prevProps.activeTab !== this.props.activeTab) {
      this.requestSearchCards(true);
    } else if (JSON.stringify(prevProps.filterTags) !== JSON.stringify(this.props.filterTags)) {
      this.requestSearchCards(true);
    } else if (prevProps.searchText !== this.props.searchText) {
      this.debouncedRequestSearch();
    }
  }

  componentWillUnmount() {
    const { updateNavigateTab } = this.props;
    updateNavigateTab(NAVIGATE_TAB_OPTION.ALL);
  }

  requestSearchCards = (clearCards) => {
    const { requestSearchCards, clearSearchCards, searchText, filterTags, activeTab, user } = this.props;
    const queryParams = { q: searchText };
    switch (activeTab) {
      case NAVIGATE_TAB_OPTION.ALL: {
        queryParams.tags = getArrayIds(filterTags).join(",");
        break;
      }
      case NAVIGATE_TAB_OPTION.MY_CARDS: {
        queryParams.statuses = Object.values(CARD_STATUS).join(",");
        queryParams.owners = user._id;
        break;
      }
      case NAVIGATE_TAB_OPTION.BOOKMARKED: {
        if (user.bookmarkIds.length === 0) {
          clearSearchCards(SEARCH_TYPE.NAVIGATE);
          return;
        } 
        queryParams.statuses = Object.values(CARD_STATUS).join(",");
        queryParams.ids = user.bookmarkIds.join(",");
        break;
      }
    }

    requestSearchCards(SEARCH_TYPE.NAVIGATE, queryParams, clearCards);
  }

  debouncedRequestSearch = _.debounce(() => {
    this.requestSearchCards(true);
  }, DEBOUNCE_60_HZ)

  updateSearchText = (e) => {
    const { updateNavigateSearchText } = this.props;
    updateNavigateSearchText(e.target.value);
  }

  render() {
    const {
      activeTab, updateNavigateTab,
      filterTags, updateFilterTags, removeFilterTag,
      cards, isSearchingCards,
      searchText, hasReachedLimit,
      requestDeleteNavigateCard, isDeletingCard, deleteError,
    } = this.props;

    return (
      <div className={s('flex flex-col flex-grow min-h-0')}>
        <div className={s('horizontal-separator m-0')} />
        <div className={s('bg-purple-xlight p-lg flex flex-col')}>
          <div className={s('flex')}>
            <input
              placeholder="Search all knowledge"
              className={s('navigate-search-input flex-grow rounded-r-none border-r-none')}
              value={searchText}
              autoFocus
              onChange={this.updateSearchText}
            />
            <div className={s('navigate-search-input-icon-container bg-white flex flex-col items-center justify-center text-purple-reg rounded-r-lg pr-reg')}> <MdSearch /> </div>
          </div>
          <AnimateHeight height={activeTab === NAVIGATE_TAB_OPTION.ALL ? 'auto' : 0}>
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
              NAVIGATE_TAB_OPTIONS.map(navigateTab => (
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
          onBottom={() => this.requestSearchCards(false)}
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
}

export default connect(
  state => ({
    ...state.navigate,
    ...state.search.cards[SEARCH_TYPE.NAVIGATE],
    user: state.profile.user,
  }),
  dispatch =>
  bindActionCreators(
    {
      ...navigateActions,
      requestSearchCards,
      clearSearchCards,
    },
    dispatch
  )
)(Navigate);

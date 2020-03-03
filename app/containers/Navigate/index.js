import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { MdSearch } from "react-icons/md";

import * as navigateActions from '../../actions/navigate';
import { openCard } from '../../actions/cards';
import { requestSearchCards } from '../../actions/search';

import CardTags from '../../components/cards/CardTags';
import AnimateHeight from 'react-animate-height';
import Tabs from '../../components/common/Tabs/Tabs';
import Tab from '../../components/common/Tabs/Tab';
import { colors } from '../../styles/colors';

import Loader from '../../components/common/Loader';
import ScrollContainer from '../../components/common/ScrollContainer';
import SuggestionCard from '../../components/suggestions/SuggestionCard';
import SuggestionPreview from '../../components/suggestions/SuggestionPreview';
import Button from '../../components/common/Button';
import Triangle from '../../components/common/Triangle';
import _ from 'underscore';

import { getArrayIds } from '../../utils/arrayHelpers'
import { CARD_STATUS, SEARCH_INFINITE_SCROLL_OFFSET, NAVIGATE_TAB_OPTION, NAVIGATE_TAB_OPTIONS, SEARCH_TYPE, DEBOUNCE_60_HZ } from '../../utils/constants';

import style from "./navigate.css";
import { getStyleApplicationFn } from '../../utils/styleHelpers';
const s = getStyleApplicationFn(style);

@connect(
  state => ({
    ...state.navigate,
    ...state.search.cards[SEARCH_TYPE.NAVIGATE],
    user: state.profile.user,
  }),
  dispatch =>
  bindActionCreators(
    {
      ...navigateActions,
      openCard,
      requestSearchCards,
    },
    dispatch
  )
)

export default class Navigate extends Component {
  componentDidMount() {
    this.requestSearchCards();
  }

  componentDidUpdate(prevProps) {
    const { updateNavigateSearchText, updateFilterTags } = this.props;

    if (prevProps.activeTab !== this.props.activeTab) {
      this.requestSearchCards(true);
    } else if (JSON.stringify(prevProps.filterTags) !== JSON.stringify(this.props.filterTags)) {
      this.requestSearchCards(true);
    }
  }

  requestSearchCards = (clearCards) => {
    const { requestSearchCards, searchText, filterTags, activeTab, user } = this.props;
    let queryParams = { q: searchText };
    switch (activeTab) {
      case NAVIGATE_TAB_OPTION.ALL: {
        queryParams.tags = getArrayIds(filterTags);
        break;
      }
      case NAVIGATE_TAB_OPTION.MY_CARDS: {
        queryParams.owners = [user._id];
        break;
      }
      case NAVIGATE_TAB_OPTION.BOOKMARKED: {
        queryParams.ids = user.bookmarkIds;
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
    this.debouncedRequestSearch();
  }

  handleOnBottom = () => {
    const { hasReachedLimit, isSearchingCards } = this.props;
    if (!hasReachedLimit && !isSearchingCards) {
      this.requestSearchCards();
    }
  }

  render() {
    const {
      activeTab, updateNavigateTab,
      filterTags, updateFilterTags, removeFilterTag,
      cards, isSearchingCards,
      searchText,
      requestDeleteNavigateCard, isDeletingCard, deleteError,
    } = this.props;

    return (
      <div className={s("flex flex-col flex-grow min-h-0")}>
        <div className={s("horizontal-separator m-0")} />
        <div className={s("bg-purple-xlight p-lg flex flex-col")}>
        	<div className={s("flex")}>
	        	<input
            	placeholder="Search all knowledge"
            	className={s("navigate-search-input flex-grow rounded-r-none border-r-none")}
              value={searchText}
              onChange={this.updateSearchText}
          	/>
          	<div className={s("navigate-search-input-icon-container bg-white flex flex-col items-center justify-center text-purple-reg rounded-r-lg pr-reg")}> <MdSearch /> </div>
        	</div>
          <AnimateHeight height={activeTab === NAVIGATE_TAB_OPTION.ALL ? 'auto' : 0}>
          	<div className={s("my-reg text-xs")}> Filter cards by tags </div>
            <CardTags
              isEditable={true}
              tags={filterTags}
              onChange={updateFilterTags}
              onRemoveClick={removeFilterTag}
              showPlaceholder={true}
              hideSelectOnBlur={true}
            />
          </AnimateHeight>
        </div>
        <div>
          <Tabs
            activeValue={activeTab}
            className={s("flex-1 flex")}
            tabClassName={s("bg-purple-xlight flex flex-col text-xs font-medium flex items-center justify-between opacity-100")}
            activeTabClassName={s("bg-purple-xlight")}
            onTabClick={updateNavigateTab}
            showRipple={false}
            color={colors.purple.reg}
          >
            {
              NAVIGATE_TAB_OPTIONS.map((navigateTab) => {
                return (
                  <Tab tabContainerClassName={s("flex-1")} value={navigateTab} key={navigateTab}>
                    <div>{navigateTab}</div>
                  </Tab>
                )
              })
            }
          </Tabs>
        </div>
        { cards.length === 0 && 
          <div className={s("py-lg")}>
            { isSearchingCards ?
              <Loader size="md" /> :
              <div className={s("text-gray-light text-sm text-center")}> No results </div>
            }
          </div>
        }
        { cards.length !== 0 &&
          <ScrollContainer
            className={s("min-h-0 flex-1")}
            scrollContainerClassName={s(`flex flex-col h-full`)}
            verticalMarginAdjust={true}
            list={cards}
            renderScrollElement={({ _id, question, answer, updatedAt, status }, i) => (
              <SuggestionCard
                _id={_id}
                question={question}
                answer={answer}
                datePosted={updatedAt}
                cardStatus={status}
                className={s(`navigate-suggestion-card mx-reg mb-reg ${i === 0 ? 'my-reg' : ''}`)}
                showMoreMenu
                deleteProps={{
                  onClick: requestDeleteNavigateCard,
                  isLoading: isDeletingCard,
                  error: deleteError,
                }}
              />
            )}
            renderOverflowElement={({ _id, question, description, answer }) => (
              <div className={s("flex")}>
                <SuggestionPreview
                  _id={_id}
                  question={question}
                  questionDescription={description}
                  answer={answer}
                />
                <Triangle
                  size={10}
                  color={'white'}
                  direction="left"
                  className={s("mt-sm")}
                  outlineSize={1}
                  outlineColor={colors.gray.light}
                />
              </div>
            )}
            position="left"
            onBottom={this.handleOnBottom}
            bottomOffset={SEARCH_INFINITE_SCROLL_OFFSET}
            footer={isSearchingCards ? <Loader size="sm" className={s("my-sm")} /> : null}
          />
        }
      </div>
    );
  }
}

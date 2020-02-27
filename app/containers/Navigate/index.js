import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { MdSearch } from "react-icons/md";

import * as navigateActions from '../../actions/navigate';
import { openCard } from '../../actions/cards';
import { requestSearchCards } from '../../actions/search';

import CardTags from '../../components/cards/CardTags';
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

import { CARD_STATUS, NAVIGATE_TAB_OPTIONS, SEARCH_TYPE, DEBOUNCE_60_HZ } from '../../utils/constants';

import style from "./navigate.css";
import { getStyleApplicationFn } from '../../utils/styleHelpers';
const s = getStyleApplicationFn(style);

@connect(
  state => ({
    ...state.navigate,
    ...state.search[SEARCH_TYPE.SIDEBAR]
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
  updateTab = (newTab) => {
    const { updateNavigateTab, updateSearchText, updateFilterTags, activeTab } = this.props;

    if (newTab !== activeTab) {
      // Clear search text and tags
      updateSearchText('');
      updateFilterTags([]);
    }

    updateNavigateTab(newTab);
  }

  componentDidMount() {
    this.requestSearchCards();
  }

  componentDidUpdate() {

  }

  requestSearchCards = () => {
    const { requestSearchCards, searchText } = this.props;
    requestSearchCards(SEARCH_TYPE.SIDEBAR, { q: searchText });
  }

  debouncedRequestSearch = _.debounce(this.requestSearchCards, DEBOUNCE_60_HZ)

  updateSearchText = (e) => {
    const { updateNavigateSearchText } = this.props;
    updateNavigateSearchText(e.target.value);
    this.debouncedRequestSearch();
  }

  render() {
    const {
      activeTab,
      filterTags, updateFilterTags, removeFilterTag,
      cards, isSearchingCards,
      searchText,
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
        	<div className={s("my-reg text-xs")}> Filter cards by tags </div>
          <CardTags
            isEditable={true}
            tags={filterTags}
            onChange={updateFilterTags}
            onRemoveClick={removeFilterTag}
            showPlaceholder={true}
            hideSelectOnBlur={true}
          />
        </div>
        <div>
          <Tabs
            activeValue={activeTab}
            className={s("flex-1 flex")}
            tabClassName={s("bg-purple-xlight flex flex-col text-xs font-medium flex items-center justify-between opacity-100")}
            activeTabClassName={s("bg-purple-xlight")}
            onTabClick={this.updateTab}
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
            className={s("min-h-0")}
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
          />
        }
      </div>
    );
  }
}

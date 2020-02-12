import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { MdSearch } from "react-icons/md";

import * as navigateActions from '../../actions/navigate';

import CardTags from '../../components/cards/CardTags';
import Tabs from '../../components/common/Tabs/Tabs';
import Tab from '../../components/common/Tabs/Tab';
import { colors } from '../../styles/colors';

import ScrollContainer from '../../components/common/ScrollContainer';
import SuggestionCard from '../../components/suggestions/SuggestionCard';
import SuggestionPreview from '../../components/suggestions/SuggestionPreview';
import Button from '../../components/common/Button';
import Triangle from '../../components/common/Triangle';

import { CARD_STATUS_OPTIONS, NAVIGATE_TAB_OPTIONS } from '../../utils/constants';

import style from "./navigate.css";
import { getStyleApplicationFn } from '../../utils/styleHelpers';
const s = getStyleApplicationFn(style);

const PLACEHOLDER_CARDS = [
  {
    heading: "How do I delete a user?",
    headingDescription: 'This is a test 1!',
    description:
      "But stream software offline. Professor install angel sector anywhere create at components smart But stream software offline. Professor install angel sector anywhere create at components smart But stream software offline. Professor install angel sector anywhere create at components smart ",
    datePosted: "2 days ago",
    cardStatus: CARD_STATUS_OPTIONS.UP_TO_DATE,
  },
  {
    heading: "How do I delete a user?",
    headingDescription: 'This is a test 2!',
    description:
      "But stream software offline. Professor install angel sector anywhere create at components smart…",

    datePosted: "2 days ago",
    cardStatus: CARD_STATUS_OPTIONS.NEEDS_VERIFICATION,
  },
  {
    heading: "How do I delete a user?",
    headingDescription: 'This is a test 3! This is a test 3! This is a test 3! This is a test 3! This is a test 3! This is a test 3! This is a test 3! This is a test 3!',
    description:
      "But stream software offline. Professor install angel sector anywhere create at components smart…",

    datePosted: "2 days ago",
    cardStatus: CARD_STATUS_OPTIONS.UP_TO_DATE,
  },
  {
    heading: "How do I delete a user?",
    description:
      "But stream software offline. Professor install angel sector anywhere create at components smart…",

    datePosted: "2 days ago",
    cardStatus: CARD_STATUS_OPTIONS.OUT_OF_DATE,
  },
  {
    heading: "How do I delete a user?",
    description:
      "But stream software offline. Professor install angel sector anywhere create at components smart…",

    datePosted: "2 days ago",
    cardStatus: CARD_STATUS_OPTIONS.UP_TO_DATE,
  },
  {
    heading: "How do I delete a user?",
    description:
      "But stream software offline. Professor install angel sector anywhere create at components smart…",

    datePosted: "2 days ago",
    cardStatus: CARD_STATUS_OPTIONS.UP_TO_DATE,
  }
];

@connect(
  state => ({
    ...state.navigate,
  }),
  dispatch =>
  bindActionCreators(
    {
      ...navigateActions,
    },
    dispatch
  )
)

export default class Navigate extends Component {
  updateTab = (tabIndex) => {
    const { updateNavigateTab } = this.props;
    updateNavigateTab(tabIndex);
  }
  render() {
    const { tabIndex, filterTags, updateFilterTags, removeFilterTag } = this.props;
    return (
      <div className={s("flex flex-col flex-grow")}>
        <div className={s("horizontal-separator m-0")}></div>
        <div className={s("bg-purple-xlight p-lg flex flex-col")}>
        	<div className={s("flex")}>
	        	<input
	            	placeholder="Search all knowledge"
	            	className={s("navigate-search-input flex-grow rounded-r-none border-r-none")}
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
              showSelect={false}
            />


          </div>
        <div>
          <Tabs
            activeValue={tabIndex}
            className={s("flex-1 flex")}
            tabClassName={s("bg-purple-xlight navigate-tab flex flex-col text-xs font-medium flex items-center justify-between opacity-100")}
            activeTabClassName={s("bg-purple-xlight")}
            onTabClick={this.updateTab}
            showRipple={false}
            color={colors.purple.reg}
          >
            {
              NAVIGATE_TAB_OPTIONS.map((navigateTab, i) => {
                return (
                  <Tab tabContainerClassName={s("flex-1")}>
                    <div>{navigateTab}</div>
                  </Tab>
                )
              })
            }
          </Tabs>
        </div>
        <div>
          <ScrollContainer
            scrollContainerClassName={s(`suggestion-panel-card-container ${false ? 'suggestion-panel-card-container-lg' : ''} flex flex-col`)}
            list={PLACEHOLDER_CARDS}
            renderScrollElement={(card) => (
              <SuggestionCard
                heading={card.heading}
                headingDescription={card.headingDescription}
                description={card.description}
                datePosted={card.datePosted}
                cardStatus={card.cardStatus}
              />
            )}
            renderOverflowElement={(card) => (
              <div className={s("flex")}>
                <SuggestionPreview {...card} />
                <Triangle
                  size={10}
                  color={colors.purple.light}
                  direction="left"
                  className={s("mt-lg")}
                  outlineSize={1}
                  outlineColor={colors.gray.light}
                />
              </div>
            )}
            footer={false && this.renderExternalDocumentationResults()}
            position="left"
          />
        </div>
      </div>
    );
  }
}

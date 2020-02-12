import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { MdSearch } from "react-icons/md";

import * as navigateActions from '../../actions/navigate';

import CardTags from '../../components/cards/CardTags';
import Tabs from '../../components/common/Tabs/Tabs';
import Tab from '../../components/common/Tabs/Tab';
import { colors } from '../../styles/colors';

import style from "./navigate.css";
import { getStyleApplicationFn } from '../../utils/styleHelpers';
const s = getStyleApplicationFn(style);

const tags = ['Customer Service Onboarding', 'Sales', 'Pitches'];
const navigateTabs = ['All', 'My Cards', 'Bookmarked'];


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

export default class Create extends Component {
  updateTab = (tabIndex) => {
    this.props.updateNavigateTab(tabIndex);
  }
  render() {
    return (
      <div className={s("flex flex-col flex-grow")}>
        <div className={s("bg-purple-xlight p-lg flex flex-col")}>
        	<div className={s("flex")}>
	        	<input
	            	placeholder="Search all knowledge"
	            	className={s("navigate-search-input flex-grow rounded-r-none border-r-none")}
	          	/>
	          	<div className={s("navigate-search-input-icon-container bg-white flex flex-col items-center justify-center text-purple-reg rounded-r-lg pr-reg")}> <MdSearch /> </div>
          	</div>
          	<div className={s("my-sm text-xs")}> View cards by tags </div>
            <CardTags
              tags={tags}
              onTagClick={() => console.log('Tag clicked')}
              onAddClick={() => console.log('Tag added')}
              onRemoveClick={() => console.log('Tag removed')}
            />


          </div>
        <div>
          <Tabs
            activeValue={this.props.tabIndex}
            className={s("flex-1 flex")}
            tabClassName={s("bg-purple-xlight navigate-tab flex flex-col text-xs font-medium flex items-center justify-between opacity-100")}
            activeTabClassName={s("bg-purple-xlight")}
            onTabClick={this.updateTab}
            showRipple={false}
            color={colors.purple.reg}
          >
            {
              navigateTabs.map((navigateTab, i) => {
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
        </div>
      </div>
    );
  }
}

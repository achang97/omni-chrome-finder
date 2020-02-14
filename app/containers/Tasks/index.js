import React, { Component, PropTypes } from 'react';
import Tabs from '../../components/common/Tabs/Tabs';
import Tab from '../../components/common/Tabs/Tab';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { colors } from '../../styles/colors';
import { IoMdAlert } from 'react-icons/io'
import { MdKeyboardArrowDown } from 'react-icons/md'
import { AiFillMinusCircle, AiFillQuestionCircle } from "react-icons/ai";

import * as tasksActions from '../../actions/tasks';
import style from "./tasks.css";
import { TASKS_TAB_OPTIONS } from '../../utils/constants';

import { getStyleApplicationFn } from '../../utils/styleHelpers';
const s = getStyleApplicationFn(style);

@connect(
  state => ({
    ...state.tasks,
  }),
  dispatch =>
  bindActionCreators(
    {
      ...tasksActions,
    },
    dispatch
  )
)

export default class Create extends Component {
  updateTab = (tabIndex) => {
    const { updateTasksTab } = this.props;
    updateTasksTab(tabIndex);
  }

  renderTaskSection = ({sectionTitle, numberNotifications, icon}) => {
  	return (
  		<div className={s("tasks-section-container flex p-reg cursor-pointer")}>
        	<div className={s("flex flex-grow")}>
        		{ icon }
	        	<div className={s("ml-reg")}>
	        		<div className={s("text-sm font-semibold mb-xs")}>{sectionTitle}</div>
	        		<div className={s("text-xs text-gray-reg")}>{numberNotifications} new notifications </div>
	        	</div>
        	</div>
        	<MdKeyboardArrowDown className={s("m-reg flex-shrink-0 text-purple-reg")}/>
        </div>
  	)
  }
  render() {
  	const { tabIndex } = this.props;
    return (
      <div class="flex flex-col flex-grow">
        <div>
          <Tabs
            activeValue={tabIndex}
            className={s("flex-1 flex")}
            tabClassName={s("bg-purple-xlight navigate-tab flex flex-col text-xs font-medium flex items-center justify-between opacity-100")}
            activeTabClassName={s("bg-purple-xlight font-semibold")}
            onTabClick={this.updateTab}
            showRipple={false}
            color={colors.purple.reg}
          >
            {
              TASKS_TAB_OPTIONS.map((tasksTab, i) => {
                return (
                  <Tab tabContainerClassName={s("flex-1")}>
                    <div>{tasksTab}</div>
                  </Tab>
                )
              })
            }
          </Tabs>
        </div>
        
        { this.renderTaskSection({sectionTitle: "Needs Verification", 
        		numberNotifications: 3, 
        		icon: <IoMdAlert className={s("tasks-icon-container text-yellow-reg")}/>, }) }
        { this.renderTaskSection({sectionTitle: "Out Of Date", 
        		numberNotifications: 7, 
        		icon: <AiFillMinusCircle className={s("tasks-icon-container text-red-reg ")}/>, }) }
        { this.renderTaskSection({sectionTitle: "Undocumented Questions", 
        		numberNotifications: 2, 
        		icon: <AiFillQuestionCircle className={s("tasks-icon-container text-purple-reg")}/>, }) }
      </div>
    );
  }
}

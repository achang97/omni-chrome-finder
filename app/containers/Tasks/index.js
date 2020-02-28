import React, { Component, PropTypes } from 'react';
import Tabs from '../../components/common/Tabs/Tabs';
import Tab from '../../components/common/Tabs/Tab';
import TaskItem from '../../components/tasks/TaskItem';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { colors } from '../../styles/colors';
import { IoMdAlert } from 'react-icons/io'
import { MdKeyboardArrowDown, MdKeyboardArrowUp, MdCheck, MdAdd, MdEdit, MdLock } from 'react-icons/md'
import { AiFillMinusCircle, AiFillQuestionCircle } from "react-icons/ai";
import Timeago from 'react-timeago';

import { openCard } from '../../actions/cards';
import * as tasksActions from '../../actions/tasks';
import style from "./tasks.css";
import { TASKS_TAB_OPTIONS, CARD_STATUS, TASKS_SECTIONS, TASKS_TYPES } from '../../utils/constants';

import { getStyleApplicationFn } from '../../utils/styleHelpers';
const s = getStyleApplicationFn(style);

const NOTIFICATIONS_PLACEHOLDER = [{
	cardStatus: CARD_STATUS.NEEDS_VERIFICATION,
	type: TASKS_TYPES.NEEDS_VERIFICATION,
	question: "How do I delete a user in this app?",
	flaggedBy: "John",
	preview: "You probably build websites and think your shit is special. You think your 13 megabyte parallax-ative home page is going to get you some fucking Awwward banner you can glue to the top corner of your site.",
}, {
	cardStatus: CARD_STATUS.NEEDS_VERIFICATION,
	type: TASKS_TYPES.OUT_OF_DATE,
	question: "How do I set a new permission group for a select set of users?",
	flaggedBy: "Jack",
	preview: "You probably build websites and think your shit is special. You think your 13 megabyte parallax-ative home page is going to get you some fucking Awwward banner you can glue to the top corner of your site.",
}, {
	cardStatus: CARD_STATUS.NEEDS_VERIFICATION,
	type: TASKS_TYPES.UNDOCUMENTED,
	question: "How do I set a new permission group for a select set of users?",
	flaggedBy: "Jack",
	preview: "You probably build websites and think your shit is special. You think your 13 megabyte parallax-ative home page is going to get you some fucking Awwward banner you can glue to the top corner of your site.",
}];

const UNRESOLVED_CARDS_PLACEHOLDER = [{
	question: "How do I do this very complex task?",
  type: TASKS_TYPES.NEEDS_APPROVAL,
	date: "Feb 2",
	tag: "Onboarding",
	owners: ["Jake", "Joe"],
	preview: "You probably build websites and think your shit is special. You think your 13 megabyte parallax-ative home page is going to get you some fucking Awwward banner you can glue to the top corner of your site.",

}, {
	question: "How do I do this very complex task?",
  type: TASKS_TYPES.NEEDS_APPROVAL,
	date: "Feb 2",
	tag: "Onboarding",
	owners: ["Jake", "Joe"],
	preview: "You probably build websites and think your shit is special. You think your 13 megabyte parallax-ative home page is going to get you some fucking Awwward banner you can glue to the top corner of your site.",

}, {
	question: "How do I do this very complex task?",
  type: TASKS_TYPES.NEEDS_APPROVAL,
	date: "Feb 2",
	tag: "Onboarding",
	owners: ["Jake", "Joe"],
	preview: "You probably build websites and think your shit is special. You think your 13 megabyte parallax-ative home page is going to get you some fucking Awwward banner you can glue to the top corner of your site.",

}

]

@connect(
  state => ({
    ...state.tasks,
  }),
  dispatch =>
  bindActionCreators(
    {
      ...tasksActions,
      openCard,
    },
    dispatch
  )
)

export default class Tasks extends Component {
  constructor(props) {
    super(props);
    this.state = {
    	sectionOpen: 'ALL',
      transitionIn: false,
    }
  }  

  componentDidMount() {
    this.props.requestGetTasks();
  }

  updateTab = (tabIndex) => {
    const { updateTasksTab } = this.props;
    updateTasksTab(tabIndex);
  }

  switchOpenSection = (newSection) => {
  	const { sectionOpen } = this.state;
  	if (newSection === sectionOpen ) this.setState({ sectionOpen: 'ALL'});
  	else this.setState({ sectionOpen: newSection });
  }


  getTaskItemInfo = (type, task) => {
    const { openCard, requestMarkUpToDateFromTasks } = this.props;
    switch (type) {
      case TASKS_TYPES.NEEDS_VERIFICATION:
        return { primaryOption: "Mark as Up to Date", secondaryOption: "Edit", primaryAction: () => { requestMarkUpToDateFromTasks(task.card._id) }, secondaryAction: () => { openCard({ _id: task.card._id, isEditing: true }) } };
      case TASKS_TYPES.OUT_OF_DATE:
        return { primaryOption: "Edit", secondaryOption: "Mark as Up to Date", primaryAction: () => { openCard({ _id: task.card._id, isEditing: true }) }, secondaryAction: () => { requestMarkUpToDateFromTasks(task.card._id) } };
      case TASKS_TYPES.UNDOCUMENTED:
        return { primaryOption: "Create Card", secondaryOption: "Dismiss", primaryAction: () => { return }, secondaryAction: () => { return } };
      case TASKS_TYPES.NEEDS_APPROVAL:
        return { primaryOption: "Approve", secondaryOption: "Decline", primaryAction: () => { return }, secondaryAction: () => { return } };
      default:
        return {}; 
    }
  }

  renderTasksList = () => {
  	const { sectionOpen } = this.state;
    const { tasks } = this.props;
  	return (
  		<div className={s("flex flex-col p-reg overflow-auto")}>
  			{
	  			tasks.map((task, i) => {
            if (!task.resolved) { 
            	const { primaryOption, primaryAction, secondaryOption, secondaryAction } = this.getTaskItemInfo(TASKS_TYPES.OUT_OF_DATE, task);
  	  				return (
  	  					<TaskItem 
  	  						index={i}
  	  						type={TASKS_TYPES.OUT_OF_DATE}
  	  						question={task.question}
  	  						preview={task.card.description}
  	  						date={<Timeago date={task.createdAt} live={false} />}
  	  						primaryOption={primaryOption}
  	  						primaryAction={primaryAction}
  	  						secondaryOption={secondaryOption}
  	  						secondaryAction={secondaryAction}
                  transitionIn={this.state.transitionIn}

                  reasonOutdated={task.card.out_of_date_reason}
  	  						/>
  	  				);
            } else { return(null)}
	  			})
  			}
  		</div>
  	)
  }

  renderTaskSection = ({ sectionTitle, numberNotifications, icon}) => {
  	const { sectionOpen } = this.state;
  	const isSectionOpen = sectionOpen === sectionTitle;
  	return (
  		<div className={s(`${isSectionOpen ? 'min-h-0 flex flex-col' : ''}`)}>
				<div className={s(`${isSectionOpen ? 'bg-white' : 'tasks-section-container'} flex items-center p-reg py-xs cursor-pointer`)} onClick={() => this.switchOpenSection(sectionTitle)}>
		      	<div className={s("flex flex-grow items-center")}>
		      		{ icon }
		      		<div className={s("ml-reg text-sm font-semibold")}>{sectionTitle}</div>
		      		<div className={s("ml-reg text-sm")}>({numberNotifications})</div>
		      	</div>
		      	{
		      		sectionOpen === sectionTitle ?
		      		<MdKeyboardArrowUp className={s("flex-shrink-0 text-purple-reg")}/>
		      		:
		      		<MdKeyboardArrowDown className={s("flex-shrink-0 text-purple-reg")}/>
		      	}
	      </div>
	      {
	      	sectionTitle === sectionOpen ?
	      	this.renderTasksList() : null
	      }
      </div>
  	)
  }

  renderUnresolvedTasks = () => {
  	return (
  		<div className={s("flex flex-col min-h-0")}>
  			{ this.state.sectionOpen === 'ALL' && this.renderTasksList() }
  			{ this.renderTaskSection({sectionTitle: TASKS_SECTIONS.NEEDS_VERIFICATION, 
        		numberNotifications: 3, 
        		icon: <IoMdAlert className={s("tasks-icon-container text-yellow-reg")}/>, }) }
        { this.renderTaskSection({sectionTitle: TASKS_SECTIONS.OUT_OF_DATE, 
        		numberNotifications: 7, 
        		icon: <AiFillMinusCircle className={s("tasks-icon-container text-red-reg ")}/>, }) }
        { this.renderTaskSection({sectionTitle: TASKS_SECTIONS.UNDOCUMENTED, 
        		numberNotifications: 2, 
        		icon: <AiFillQuestionCircle className={s("tasks-icon-container text-purple-reg")}/>, }) }
  		</div>
  	)
  }

  renderApprovalTasks = () => {
  	return (
  		<div className={s("flex flex-col p-reg min-h-0 overflow-auto")}> 
  			{
	  			UNRESOLVED_CARDS_PLACEHOLDER.map((notification, i) => {
            const { primaryOption, primaryAction, secondaryOption, secondaryAction } = this.getTaskItemInfo(notification.type);
            return (
              <TaskItem 
                index={i}
                type={notification.type}
                question={notification.question}
                preview={notification.preview}
                date={"Feb 2"}
                primaryOption={primaryOption}
                primaryAction={primaryAction}
                secondaryOption={secondaryOption}
                secondaryAction={secondaryAction}
                transitionIn={this.state.transitionIn}
                />
            );
	  			})
  			}
  		</div>
  	)
  }

  showNotifs = () => {
    this.setState({transitionIn: !this.state.transitionIn});
  }

  render() {
  	const { tabIndex } = this.props;
    console.log(this.props.tasks);
    return (
      <div className={s("flex flex-col min-h-0")}>
          <Tabs
            activeValue={tabIndex}
            className={s("flex flex-shrink-0")}
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
          <div onClick={() => this.showNotifs()}> Hello </div>
          { tabIndex === 0 ? 
          	this.renderUnresolvedTasks()
          	:
          	this.renderApprovalTasks()
          }
      </div>
    );
  }
}

import React, { Fragment, Component, PropTypes } from 'react';
import AnimateHeight from 'react-animate-height';
import Tabs from '../../components/common/Tabs/Tabs';
import Tab from '../../components/common/Tabs/Tab';
import TaskItem from '../../components/tasks/TaskItem';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { colors } from '../../styles/colors';
import { FaDotCircle } from 'react-icons/fa';
import { IoMdAlert } from 'react-icons/io';
import { MdKeyboardArrowDown, MdKeyboardArrowUp, MdCheck, MdAdd, MdEdit, MdLock, MdNotifications } from 'react-icons/md';
import { AiFillMinusCircle, AiFillQuestionCircle } from "react-icons/ai";
import Timeago from 'react-timeago';
import Loader from '../../components/common/Loader';

import * as tasksActions from '../../actions/tasks';
import style from "./tasks.css";
import { TASKS_TAB_OPTIONS, CARD_STATUS, TASKS_SECTIONS, TASKS_TYPES } from '../../utils/constants';

import { getStyleApplicationFn } from '../../utils/styleHelpers';
const s = getStyleApplicationFn(style);

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
    },
    dispatch
  )
)

export default class Tasks extends Component {
  constructor(props) {
    super(props);
    this.state = {
    	sectionOpen: TASKS_SECTIONS.ALL,

      allTasks: [],
      needsVerificationTasks: [],
      outOfDateTasks: [],
      undocumentedTasks: [],
    }
  }  

  componentDidMount() {
    const { requestGetTasks } = this.props;
    requestGetTasks();

  }

  componentDidUpdate(prevProps) {
    const { tasks } = this.props;
    if(tasks !== prevProps.tasks) {
      this.setState({
        allTasks: tasks.filter((task) => { return (!task.resolved && TASKS_SECTIONS.ALL.types.includes(task.status))} ),
        needsVerificationTasks: tasks.filter((task) => { return (!task.resolved && TASKS_SECTIONS.NEEDS_VERIFICATION.types.includes(task.status))} ),
        outOfDateTasks: tasks.filter((task) => { return (!task.resolved && TASKS_SECTIONS.OUT_OF_DATE.types.includes(task.status))} ),
        undocumentedTasks: tasks.filter((task) => { return (!task.resolved && TASKS_SECTIONS.UNDOCUMENTED.types.includes(task.status))} ),
      })
    }

    // Typical usage (don't forget to compare props):
    if (this.props.userID !== prevProps.userID) {
      this.fetchData(this.props.userID);
    }
  }

  updateTab = (tabIndex) => {
    const { updateTasksTab } = this.props;
    updateTasksTab(tabIndex);
  }

  switchOpenSection = (newSection) => {
  	const { sectionOpen } = this.state;
  	if (newSection === sectionOpen ) this.setState({ sectionOpen: TASKS_SECTIONS.ALL});
  	else this.setState({ sectionOpen: newSection });
  }

  renderTasksList = (filteredTasks) => {
  	return (
  		<div className={s("flex flex-col p-reg overflow-auto")}>
  			{
	  			filteredTasks.map((task, i) => {
	  				return (
	  					<TaskItem 
	  						index={i}
                id={task._id}
                date={<Timeago date={task.createdAt} live={false} />}
	  						type={task.status}
                card={task.card}
	  						/>
	  				);
	  			})
  			}
  		</div>
  	)
  }

  getTaskSectionProps(section) {
    const { allTasks, needsVerificationTasks, outOfDateTasks, undocumentedTasks } = this.state;
    switch (section) {
      case TASKS_SECTIONS.ALL:
        return { sectionTitle: TASKS_SECTIONS.ALL.title, 
          icon: <MdNotifications className={s("all-tasks-icon-container rounded-full")}/>,
          filteredTasks: allTasks };
      case TASKS_SECTIONS.NEEDS_VERIFICATION:
        return { sectionTitle: TASKS_SECTIONS.NEEDS_VERIFICATION.title, 
          icon: <IoMdAlert className={s("tasks-icon-container text-yellow-reg")}/>,
          filteredTasks: needsVerificationTasks, };
      case TASKS_SECTIONS.OUT_OF_DATE:
        return { sectionTitle: TASKS_SECTIONS.OUT_OF_DATE.title, 
          icon: <AiFillMinusCircle className={s("tasks-icon-container text-red-reg ")}/>,
          filteredTasks: outOfDateTasks, };
      case TASKS_SECTIONS.UNDOCUMENTED:
        return { sectionTitle: TASKS_SECTIONS.UNDOCUMENTED.title, 
          icon: <AiFillQuestionCircle className={s("tasks-icon-container text-purple-reg")}/>,
          filteredTasks: undocumentedTasks, };
      default:
        return {}; 
    }
  }

  renderUnresolvedTasks = () => {
    const { sectionOpen, isGettingTasks } = this.state;
  	return (
  		<div className={s("flex flex-col min-h-0 flex-grow")}>
        { 
          isGettingTasks ?
          <Loader className={s('')}/>
          :
          Object.keys(TASKS_SECTIONS).map((section) => 
          {
            const { sectionTitle, icon, filteredTasks } = this.getTaskSectionProps(TASKS_SECTIONS[section]);
            const isSectionOpen = sectionOpen === TASKS_SECTIONS[section];
            const isAllTasksSection = TASKS_SECTIONS[section] === TASKS_SECTIONS.ALL;

            return(
              <React.Fragment>
                { 
                  (filteredTasks.length > 0) &&
                  <div className={s(`${isSectionOpen ? 'min-h-0 flex flex-col' : ''}`)}>
                    <div className={s(`${isSectionOpen ? 'bg-white' : 'tasks-section-container'} flex items-center p-reg py-sm cursor-pointer`)} onClick={() => this.switchOpenSection(TASKS_SECTIONS[section])}>
                        <div className={s("flex flex-grow items-center")}>
                          { icon }
                          <div className={s("ml-reg text-sm font-semibold")}>{sectionTitle}</div>
                          { !isAllTasksSection &&  <div className={s("ml-reg text-sm")}>({ filteredTasks.length })</div> }
                        </div>
                        {
                          !isAllTasksSection &&
                            <React.Fragment>
                              {
                                isSectionOpen ? 
                                <MdKeyboardArrowUp className={s("flex-shrink-0 text-purple-reg")}/>
                                :
                                <MdKeyboardArrowDown className={s("flex-shrink-0 text-purple-reg")}/>
                              }
                            </React.Fragment>
                        }
                    </div>
                    <AnimateHeight height={isSectionOpen ? 'auto' : 0}>
                      {this.renderTasksList(filteredTasks)}
                    </AnimateHeight>
                  </div>
                }
              </React.Fragment>
            )
          }
        )}
  		</div>
  	)
  }

  renderApprovalTasks = () => {
  	return (
  		<div className={s("flex flex-col p-reg min-h-0 overflow-auto")}> 
  			{/*
	  			UNRESOLVED_CARDS_PLACEHOLDER.map((task, i) => {
            return (
              <TaskItem 
                index={i}
                id={task._id}
                date={<Timeago date={task.createdAt} live={false} />}
                type={task.status}
                card={task.card}
              />
            );
	  			})
  			*/}
  		</div>
  	)
  }

  renderNoTasksScreen = () => {
    return (
      <div className={s('flex flex-col items-center p-reg justify-center')}>
        <div> No unresolved tasks </div>
        <div> Congratulations, all your cards are verified and up to date! </div>
      </div>
    )
  }

  render() {
  	const { tabIndex, tasks } = this.props;
    console.log(this.props.tasks);

    return (
      <div className={s("flex flex-col min-h-0 flex-grow")}>
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
          { tabIndex === 0 ? 
            <React.Fragment>
            {
              tasks.length === 0 ?
              this.renderNoTasksScreen()
              :
          	  this.renderUnresolvedTasks()
            }
            </React.Fragment>
          	:
          	this.renderApprovalTasks()
          }
      </div>
    );
  }
}

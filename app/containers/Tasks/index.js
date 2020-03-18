import React, { Fragment, Component, PropTypes } from 'react';
import AnimateHeight from 'react-animate-height';
import Tabs from '../../components/common/Tabs/Tabs';
import Tab from '../../components/common/Tabs/Tab';
import TaskItem from '../../components/tasks/TaskItem';
import NoNotificationsImg from '../../assets/images/general/noNotifications.svg';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { colors } from '../../styles/colors';
import { FaDotCircle } from 'react-icons/fa';
import { IoMdAlert } from 'react-icons/io';
import { MdKeyboardArrowDown, MdKeyboardArrowUp, MdCheck, MdAdd, MdEdit, MdLock, MdNotifications } from 'react-icons/md';
import { AiFillMinusCircle, AiFillQuestionCircle } from 'react-icons/ai';
import Timeago from 'react-timeago';
import Loader from '../../components/common/Loader';

import { updateTasksOpenSection, requestGetTasks, updateTasksTab, removeTask } from '../../actions/tasks';
import style from './tasks.css';
import { CARD_STATUS, TASK_TYPE, TASKS_SECTION_TYPE, TASKS_SECTIONS, TASKS_TAB_OPTIONS } from '../../utils/constants';

import { getStyleApplicationFn } from '../../utils/style';
const s = getStyleApplicationFn(style);

const UNRESOLVED_CARDS_PLACEHOLDER = [{
  question: 'How do I do this very complex task?',
  type: TASK_TYPE.NEEDS_APPROVAL,
  date: 'Feb 2',
  tag: 'Onboarding',
  owners: ['Jake', 'Joe'],
  preview: 'You probably build websites and think your shit is special. You think your 13 megabyte parallax-ative home page is going to get you some fucking Awwward banner you can glue to the top corner of your site.',

}, {
  question: 'How do I do this very complex task?',
  type: TASK_TYPE.NEEDS_APPROVAL,
  date: 'Feb 2',
  tag: 'Onboarding',
  owners: ['Jake', 'Joe'],
  preview: 'You probably build websites and think your shit is special. You think your 13 megabyte parallax-ative home page is going to get you some fucking Awwward banner you can glue to the top corner of your site.',

}, {
  question: 'How do I do this very complex task?',
  type: TASK_TYPE.NEEDS_APPROVAL,
  date: 'Feb 2',
  tag: 'Onboarding',
  owners: ['Jake', 'Joe'],
  preview: 'You probably build websites and think your shit is special. You think your 13 megabyte parallax-ative home page is going to get you some fucking Awwward banner you can glue to the top corner of your site.',

}

];

@connect(
  state => ({
    ...state.tasks,
  }),
  dispatch =>
  bindActionCreators(
    {
      updateTasksOpenSection,
      requestGetTasks,
      updateTasksTab,
      removeTask
    },
    dispatch
  )
)

export default class Tasks extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { requestGetTasks } = this.props;
    requestGetTasks();
  }

  componentWillUnmount() {
    const { updateTasksOpenSection } = this.props;
    updateTasksOpenSection(TASKS_SECTION_TYPE.ALL);
  }

  updateTab = (tabIndex) => {
    const { updateTasksTab } = this.props;
    updateTasksTab(tabIndex);
  }

  switchOpenSection = (newSection) => {
    const { openSection, updateTasksOpenSection } = this.props;
    if (newSection === openSection) {
      updateTasksOpenSection(TASKS_SECTION_TYPE.ALL);
    } else {
      updateTasksOpenSection(newSection);
    }
  }

  renderTasksList = (type, filteredTasks) => (
    <div className={s('h-full flex flex-col p-reg overflow-auto')}>
      {
        filteredTasks.map(({ _id, createdAt, status, card, isLoading, error, resolved }, i) => (
          <TaskItem
            key={_id}
            id={_id}
            className={i > 0 ? 'mt-reg' : ''}
            date={createdAt}
            type={status}
            card={card}
            isLoading={isLoading}
            error={error}
            resolved={resolved}
            onHide={type === TASKS_SECTION_TYPE.ALL ? () => this.props.removeTask(_id) : null}
          />
        ))
      }
    </div>
  )

  getTaskSectionProps(type) {
    const { tasks } = this.props;

    let icon;
    switch (type) {
      case TASKS_SECTION_TYPE.ALL: {
        icon = <MdNotifications className={s('all-tasks-icon-container rounded-full')} />;
        break;
      }
      case TASKS_SECTION_TYPE.NEEDS_VERIFICATION: {
        icon = <IoMdAlert className={s('tasks-icon-container text-yellow-reg')} />;
        break;
      }
      case TASKS_SECTION_TYPE.OUT_OF_DATE: {
        icon = <AiFillMinusCircle className={s('tasks-icon-container text-red-reg ')} />;
        break;
      }
      case TASKS_SECTION_TYPE.UNDOCUMENTED: {
        icon = <AiFillQuestionCircle className={s('tasks-icon-container text-purple-reg')} />;
      }
    }

    return { icon, filteredTasks: tasks[type] };
  }

  renderTaskSection = ({ type, title }) => {
    const { openSection } = this.props;
    const { icon, filteredTasks } = this.getTaskSectionProps(type);
    const isSectionOpen = openSection === type;
    const isAllTasksSection = type === TASKS_SECTION_TYPE.ALL;

    if (filteredTasks.length === 0) {
      return null;
    }

    return (
      <div key={type} className={s(`tasks-section-container ${isSectionOpen ? 'flex-1' : ''}`)}>
        <div
          className={s(`tasks-section-header ${isSectionOpen ? 'bg-white' : 'task-section-header-active'}`)}
          onClick={() => this.switchOpenSection(type)}
        >
          { icon }
          <div className={s('ml-reg text-sm font-semibold')}>{title}</div>
          { !isAllTasksSection && <div className={s('ml-reg text-sm flex-1')}>({ filteredTasks.length })</div> }
          { !isAllTasksSection && (isSectionOpen ?
            <MdKeyboardArrowUp className={s('flex-shrink-0 text-purple-reg')} /> :
            <MdKeyboardArrowDown className={s('flex-shrink-0 text-purple-reg')} />
          )}
        </div>
        <div className={s('flex-1 min-h-0 overflow-auto')}>
          <AnimateHeight height={isSectionOpen ? 'auto' : 0}>
            {this.renderTasksList(type, filteredTasks)}
          </AnimateHeight>
        </div>
      </div>
    );
  }

  renderUnresolvedTasks = () => {
    const { isGettingTasks } = this.props;

    return (
      <div className={s('flex flex-col h-full flex-grow')}>
        { isGettingTasks ?
          <Loader /> :
          TASKS_SECTIONS.map(this.renderTaskSection)  
        }
      </div>
    );
  }

  renderApprovalTasks = () => (
    <div className={s('flex flex-col p-reg min-h-0 overflow-auto')}>
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

  renderNoTasksScreen = () => (
    <div className={s('flex flex-col items-center p-reg justify-center mt-2xl')}>
      <img src={NoNotificationsImg} />
      <div className={s('text-reg font-semibold')}> No unresolved tasks </div>
      <div className={s('text-sm mt-xl text-center')}> Congratulations, all your cards are verified and up to date! </div>
    </div>
    )

  render() {
    const { tabIndex, tasks, isGettingTasks, getTasksError } = this.props;
    const allTasks = tasks[TASKS_SECTION_TYPE.ALL];

    return (
      <div className={s('flex flex-col min-h-0 flex-grow')}>
        <Tabs
          activeValue={tabIndex}
          className={s('flex flex-shrink-0')}
          tabClassName={s('bg-purple-xlight navigate-tab flex flex-col text-xs font-medium flex items-center justify-between opacity-100')}
          activeTabClassName={s('bg-purple-xlight font-semibold')}
          onTabClick={this.updateTab}
          showRipple={false}
          color={colors.purple.reg}
        >
          {
              TASKS_TAB_OPTIONS.map((tasksTab, i) => (
                <Tab tabContainerClassName={s('flex-1')} key={tasksTab}>
                  <div>{tasksTab}</div>
                </Tab>
                ))
            }
        </Tabs>
        { tabIndex === 0 ?
          <React.Fragment>
            { getTasksError && <div> {getTasksError} </div>}
            {
              isGettingTasks ?
                <Loader className={s('mt-2xl')} />
              :
                <React.Fragment>
                  <AnimateHeight height={allTasks.length === 0 ? 'auto' : 0}>
                    {this.renderNoTasksScreen()}
                  </AnimateHeight>
                  <AnimateHeight height={allTasks.length !== 0 ? 'auto' : 0} className={s('min-h-0')} contentClassName={s('h-full')}>
                    {this.renderUnresolvedTasks()}
                  </AnimateHeight>
                </React.Fragment>
            }
          </React.Fragment>
            :
            this.renderApprovalTasks()
          }
      </div>
    );
  }
}

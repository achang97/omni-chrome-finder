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

class Tasks extends Component {
  componentDidMount() {
    const { requestGetTasks } = this.props;
    requestGetTasks();
  }

  componentDidUpdate(prevProps) {
    const { tabIndex, requestGetTasks } = this.props;
    if (prevProps.tabIndex !== tabIndex) {
      requestGetTasks();
    }
  }

  componentWillUnmount() {
    const { updateTasksOpenSection, updateTasksTab } = this.props;
    updateTasksOpenSection(TASKS_SECTION_TYPE.ALL);
    updateTasksTab(0);
  }

  getCurrTasks = (tabIndex) => {
    const { tasks } = this.props;
    const currTasks = tasks.filter(({ status }) => {
      const needsApproval = status === TASK_TYPE.NEEDS_APPROVAL;
      return tabIndex === 0 ? (!needsApproval) : needsApproval;
    });
    return currTasks;
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
        filteredTasks.map(({ _id, createdAt, status, card, isLoading, error, resolved, notifier }, i) => (
          <TaskItem
            key={_id}
            id={_id}
            className={i > 0 ? 'mt-reg' : ''}
            createdAt={createdAt}
            type={status}
            card={card}
            isLoading={isLoading}
            error={error}
            resolved={resolved}
            notifier={notifier}
            onHide={() => this.props.removeTask(_id)}
          />
        ))
      }
    </div>
  )

  getTaskSectionProps(type, taskTypes) {
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

    const filteredTasks = tasks.filter(({ status }) => taskTypes.includes(status));
    return { icon, filteredTasks };
  }

  renderTaskSection = ({ type, title, taskTypes }) => {
    const { openSection } = this.props;
    const { icon, filteredTasks } = this.getTaskSectionProps(type, taskTypes);
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

  renderNoTasksScreen = () => {
    const { tabIndex } = this.props;

    return (
      <div className={s('flex flex-col items-center p-reg justify-center mt-2xl')}>
        <img src={NoNotificationsImg} />
        <div className={s('text-reg font-semibold')}>
          No {tabIndex === 0 ? 'unresolved tasks' : 'cards to approve'}
        </div>
        <div className={s('text-sm mt-xl text-center')}>
          Congratulations, all your cards are {tabIndex === 0 ? 'verified and up to date!' : 'approved!'}
        </div>
      </div>
    );
  }

  renderTab = (tasksTab, i) => {
    const numTasks = this.getCurrTasks(i).length;
    return (
      <Tab tabContainerClassName={s('flex-1')} key={tasksTab}>
        <div className={s('flex items-center')}>
          <div> {tasksTab} </div>
          { numTasks !== 0 &&
            <div className={s('tasks-tab-count')}> {numTasks} </div>
          }
        </div>
      </Tab>
    );
  }

  render() {
    const { tabIndex, tasks, isGettingTasks, getTasksError } = this.props;
    const currTasks = this.getCurrTasks(tabIndex);

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
          { TASKS_TAB_OPTIONS.map(this.renderTab)}
        </Tabs>
        <React.Fragment>
          { isGettingTasks ?
            <Loader className={s('mt-2xl')} /> :
            <React.Fragment>
              {getTasksError && <div> {getTasksError} </div>}
              { currTasks.length === 0 &&
                <div>
                  {this.renderNoTasksScreen()}
                </div>
              }
              { tabIndex === 0 ?
                <div className={s('flex flex-col min-h-0 flex-grow')}>
                  { TASKS_SECTIONS.map(this.renderTaskSection) }
                </div> :
                this.renderTasksList(TASKS_SECTION_TYPE.NEEDS_APPROVAL, currTasks)
              }
            </React.Fragment>
          }
        </React.Fragment>
      </div>
    );
  }
}

export default connect(
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
)(Tasks);

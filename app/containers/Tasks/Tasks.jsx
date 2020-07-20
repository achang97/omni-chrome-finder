import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import AnimateHeight from 'react-animate-height';
import { IoMdAlert } from 'react-icons/io';
import { MdKeyboardArrowDown, MdKeyboardArrowUp, MdNotifications, MdLock } from 'react-icons/md';
import { AiFillMinusCircle, AiFillQuestionCircle } from 'react-icons/ai';

import { Tabs, Tab, Loader } from 'components/common';
import TaskItem from 'components/tasks/TaskItem';

import { TYPE, SECTION_TYPE, SECTIONS, TAB_OPTIONS } from 'appConstants/tasks';
import { STATUS } from 'appConstants/card';

import NoNotificationsImg from 'assets/images/general/noNotifications.svg';

import { colors } from 'styles/colors';
import { getStyleApplicationFn } from 'utils/style';
import style from './tasks.css';

const s = getStyleApplicationFn(style);

const Tasks = ({
  tabIndex,
  tasks,
  openSection,
  isGettingTasks,
  updateTasksOpenSection,
  updateTasksTab,
  requestGetTasks,
  removeTask
}) => {
  useEffect(() => {
    return () => {
      updateTasksOpenSection(SECTION_TYPE.ALL);
      updateTasksTab(0);
    };
  }, [updateTasksOpenSection, updateTasksTab]);

  useEffect(() => {
    requestGetTasks();
  }, [tabIndex, requestGetTasks]);

  const getTasks = (index) => {
    const currTasks = tasks.filter(({ status }) => {
      const needsApproval = status === TYPE.NEEDS_APPROVAL;
      return index === 0 ? !needsApproval : needsApproval;
    });
    return currTasks;
  };

  const switchOpenSection = (newSection) => {
    if (newSection === openSection) {
      updateTasksOpenSection(SECTION_TYPE.ALL);
    } else {
      updateTasksOpenSection(newSection);
    }
  };

  const renderTasksList = (type, filteredTasks) => (
    <div className={s('h-full flex flex-col p-reg overflow-auto')}>
      {filteredTasks.map(
        ({ _id, createdAt, status, card, isLoading, error, resolved, notifier, data }, i) => (
          <TaskItem
            key={_id}
            id={_id}
            className={i > 0 ? 'mt-reg' : ''}
            createdAt={createdAt}
            type={status}
            card={card}
            data={data}
            isLoading={isLoading}
            error={error}
            resolved={resolved}
            notifier={notifier}
            onHide={() => removeTask(_id)}
          />
        )
      )}
    </div>
  );

  const getTaskSectionProps = (type, taskTypes) => {
    let icon;
    switch (type) {
      case SECTION_TYPE.ALL: {
        icon = <MdNotifications className={s('all-tasks-icon-container rounded-full')} />;
        break;
      }
      case SECTION_TYPE.NEEDS_VERIFICATION: {
        icon = <IoMdAlert className={s('tasks-icon-container text-yellow-reg')} />;
        break;
      }
      case SECTION_TYPE.OUT_OF_DATE: {
        icon = <AiFillMinusCircle className={s('tasks-icon-container text-red-reg')} />;
        break;
      }
      case SECTION_TYPE.NOT_DOCUMENTED: {
        icon = <AiFillQuestionCircle className={s('tasks-icon-container text-purple-reg')} />;
        break;
      }
      case SECTION_TYPE.REQUEST_EDIT_ACCESS: {
        icon = <MdLock className={s('tasks-icon-container text-yellow-500')} />;
        break;
      }
      default:
        break;
    }

    const filteredTasks = tasks.filter(({ status }) => taskTypes.includes(status));
    return { icon, filteredTasks };
  };

  const renderTaskSection = (section) => {
    const { type, title, taskTypes } = section;
    const { icon, filteredTasks } = getTaskSectionProps(type, taskTypes);
    const isSectionOpen = openSection === type;
    const isAllTasksSection = type === SECTION_TYPE.ALL;

    if (filteredTasks.length === 0) {
      return null;
    }

    return (
      <div key={type} className={s(`tasks-section-container ${isSectionOpen ? 'flex-1' : ''}`)}>
        <div
          className={s(
            `tasks-section-header ${isSectionOpen ? 'bg-white' : 'task-section-header-active'}`
          )}
          onClick={() => switchOpenSection(type)}
        >
          {icon}
          <div className={s('ml-reg text-sm font-semibold')}>{title}</div>
          {!isAllTasksSection && (
            <div className={s('ml-reg text-sm flex-1')}>({filteredTasks.length})</div>
          )}
          {!isAllTasksSection &&
            (isSectionOpen ? (
              <MdKeyboardArrowUp className={s('flex-shrink-0 text-purple-reg')} />
            ) : (
              <MdKeyboardArrowDown className={s('flex-shrink-0 text-purple-reg')} />
            ))}
        </div>
        <div className={s('flex-1 min-h-0 overflow-auto')}>
          <AnimateHeight height={isSectionOpen ? 'auto' : 0}>
            {renderTasksList(type, filteredTasks)}
          </AnimateHeight>
        </div>
      </div>
    );
  };

  const renderNoTasksScreen = () => {
    return (
      <div className={s('flex flex-col items-center p-reg justify-center mt-2xl')}>
        <img src={NoNotificationsImg} alt="No Notifications" />
        <div className={s('text-reg font-semibold')}>
          No {tabIndex === 0 ? 'unresolved tasks' : 'cards to approve'}
        </div>
        <div className={s('text-sm mt-xl text-center')}>
          Congratulations, all your cards are{' '}
          {tabIndex === 0 ? 'verified and up to date!' : 'approved!'}
        </div>
      </div>
    );
  };

  const renderTab = (tasksTab, i) => {
    const numTasks = getTasks(i).length;
    return (
      <Tab tabContainerClassName={s('flex-1')} key={tasksTab}>
        <div className={s('flex items-center')}>
          <div> {tasksTab} </div>
          {numTasks !== 0 && <div className={s('tasks-tab-count')}> {numTasks} </div>}
        </div>
      </Tab>
    );
  };

  const currTasks = getTasks(tabIndex);
  return (
    <div className={s('flex flex-col min-h-0 flex-grow')}>
      <Tabs
        activeValue={tabIndex}
        className={s('flex flex-shrink-0')}
        tabClassName={s(
          'navigate-tab flex flex-col text-xs font-medium flex items-center justify-between opacity-100'
        )}
        activeTabClassName={s('font-semibold')}
        onTabClick={updateTasksTab}
        showRipple={false}
        color={colors.purple.reg}
      >
        {TAB_OPTIONS.map(renderTab)}
      </Tabs>
      <>
        {isGettingTasks ? (
          <Loader className={s('mt-2xl')} />
        ) : (
          <>
            {currTasks.length === 0 && <div>{renderNoTasksScreen()}</div>}
            {tabIndex === 0 ? (
              <div className={s('flex flex-col min-h-0 flex-grow')}>
                {SECTIONS.map(renderTaskSection)}
              </div>
            ) : (
              renderTasksList(SECTION_TYPE.NEEDS_APPROVAL, currTasks)
            )}
          </>
        )}
      </>
    </div>
  );
};

Tasks.propTypes = {
  // Redux State
  tabIndex: PropTypes.number.isRequired,
  tasks: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      createdAt: PropTypes.string.isRequired,
      status: PropTypes.oneOf(Object.values(STATUS)),
      card: PropTypes.object,
      resolved: PropTypes.bool.isRequired,
      notifier: PropTypes.object,
      isLoading: PropTypes.bool,
      error: PropTypes.string
    })
  ).isRequired,
  openSection: PropTypes.string.isRequired,
  isGettingTasks: PropTypes.bool,

  // Redux Actions
  updateTasksOpenSection: PropTypes.func.isRequired,
  updateTasksTab: PropTypes.func.isRequired,
  requestGetTasks: PropTypes.func.isRequired,
  removeTask: PropTypes.func.isRequired
};

Tasks.defaultProps = {
  isGettingTasks: false
};

export default Tasks;

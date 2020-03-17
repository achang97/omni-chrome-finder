import _ from 'lodash';
import * as types from '../actions/actionTypes';
import { createSectionedTasks } from '../utils/tasks';
import { TASKS_SECTION_TYPE } from '../utils/constants';

export const initialState = {
  tabIndex: 0,
  openSection: TASKS_SECTION_TYPE.ALL,
  tasks: _.mapValues(TASKS_SECTION_TYPE, () => []),

  isGettingTasks: false,
  isUpdatingCard: false,
  isDismissingTask: false,
};

export default function tasksReducer(state = initialState, action) {
  const { type, payload = {} } = action;

  const updateTask = (taskId, newInfo) => {
    return {
      ...state,
      tasks: _.mapValues(state.tasks, (currTasks) => (
        currTasks.map((currTask) => (
          currTask._id === taskId ? { ...currTask, ...newInfo } : currTask
        ))
      ))
    };
  }

  switch (type) {
    case types.UPDATE_TASKS_TAB: {
      const { tabIndex } = payload;
      return { ...state, tabIndex, openSection: tabIndex === 0 ? TASKS_SECTION_TYPE.ALL : state.openSection };
    }
    case types.UPDATE_OPEN_SECTION: {
      const { section } = payload;
      return { ...state, openSection: section };
    }

    case types.GET_TASKS_REQUEST: {
      return { ...state, isGettingTasks: true, getTasksError: null };
    }
    case types.GET_TASKS_SUCCESS: {
      const { tasks } = payload;
      const newTasks = createSectionedTasks(tasks);
      return { ...state, isGettingTasks: false, tasks: newTasks };
    }
    case types.GET_TASKS_ERROR: {
      const { error } = payload;
      return { ...state, isGettingUser: false, getTasksError: error };
    }

    case types.MARK_UP_TO_DATE_FROM_TASKS_REQUEST:
    case types.DISMISS_TASK_REQUEST: {
      const { taskId } = payload;
      return updateTask(taskId, { isLoading: true, error: null });
    }
    case types.MARK_UP_TO_DATE_FROM_TASKS_SUCCESS:
    case types.DISMISS_TASK_SUCCESS: {
      const { taskId } = payload;
      return updateTask(taskId, { isLoading: false, resolved: true });
    }
    case types.MARK_UP_TO_DATE_FROM_TASKS_ERROR:
    case types.DISMISS_TASK_ERROR: {
      const { taskId, error } = payload;
      return updateTask(taskId, { isLoading: false, error });
    }

    case types.REMOVE_TASK: {
      const { taskId } = payload;
      return {
        ...state,
        tasks: _.mapValues(state.tasks, (currTasks) => (
          currTasks.filter(task => task._id !== taskId)
        ))
      };
    }

    case types.SYNC_TASKS: {
      const { tasks } = payload;
      return {
        ...state,
        tasks: createSectionedTasks(tasks)
      };
    }

    default:
      return state;
  }
}

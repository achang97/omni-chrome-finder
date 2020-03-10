import * as types from '../actions/actionTypes';
import { removeIndex } from '../utils/array';
import { TASKS_SECTIONS, TASKS_SECTION_TYPE } from '../utils/constants';
import _ from 'lodash';

const initialState = {
  tabIndex: 0,
  tasks: _.mapValues(TASKS_SECTION_TYPE, () => []),

  isGettingTasks: false,
  isUpdatingCard: false,
  isDismissingTask: false,
};

export default function tasks(state = initialState, action) {
  const { type, payload = {} } = action;

  switch (type) {
    case types.UPDATE_TASKS_TAB: {
      const { tabIndex } = payload;
      return { ...state, tabIndex };
    }

    case types.GET_TASKS_REQUEST: {
      return { ...state, isGettingTasks: true, getTasksError: null };
    }
    case types.GET_TASKS_SUCCESS: {
      const { notifs } = payload;

      const tasks = {};
      TASKS_SECTIONS.forEach(({ type, taskTypes }) => {
        tasks[type] = notifs.filter((task) => { return (!task.resolved && taskTypes.includes(task.status))} )
      });

      return { ...state, isGettingTasks: false, tasks };
    }
    case types.GET_TASKS_ERROR: {
      const { error } = payload;
      return { ...state, isGettingUser: false, getTasksError: error };
    }

    case types.MARK_UP_TO_DATE_FROM_TASKS_REQUEST: {
      return { ...state, isUpdatingCard: true, markCardUpToDateError: null };
    }
    case types.MARK_UP_TO_DATE_FROM_TASKS_SUCCESS: {
      return { ...state, isUpdatingCard: false }
    }
    case types.MARK_UP_TO_DATE_FROM_TASKS_ERROR: {
      const { error } = payload;
      return { ...state, isUpdatingCard: false, markCardUpToDateError: error };
    }

    case types.DISMISS_TASK_REQUEST: {
      return { ...state, isDismissingTask: true, dimissTaskError: null };
    }
    case types.DISMISS_TASK_SUCCESS: {
      return { ...state, isDismissingTask: false };
    }
    case types.DISMISS_TASK_ERROR: {
      const { error } = payload;
      return { ...state, isDismissingTask: false, dimissTaskError: error };
    }

    default:
      return state;
  }
}

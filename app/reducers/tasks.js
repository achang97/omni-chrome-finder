import * as types from '../actions/actionTypes';
import { removeIndex } from '../utils/arrayHelpers';
import _ from 'lodash';

const initialState = {
  tabIndex: 0,

  isGettingTasks: false,
  tasks: [],

  isUpdatingCard: false,

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
      return { ...state, isGettingTasks: false, tasks: notifs };
    }
    case types.GET_TASKS_ERROR: {
      const { error } = payload;
      return { ...state, isGettingUser: false, getTasksError: error };
    }

    case types.MARK_UP_TO_DATE_FROM_TASKS_REQUEST: {
      const { cardId } = payload;
      return { ...state, isUpdatingCard: true, getCardUpdateError: null };
    }
    case types.MARK_UP_TO_DATE_FROM_TASKS_SUCCESS: {
      return { ...state, isUpdatingCard: false }
    }
    case types.MARK_UP_TO_DATE_FROM_TASKS_ERROR: {
      const { error } = payload;
      return { ...state, isUpdatingCard: false, getCardUpdateError: error };
    }

    default:
      return state;
  }
}

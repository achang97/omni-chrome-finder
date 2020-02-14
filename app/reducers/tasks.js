import * as types from '../actions/actionTypes';
import { removeIndex } from '../utils/arrayHelpers';
import _ from 'underscore';

const initialState = {
  tabIndex: 0,
};

export default function tasks(state = initialState, action) {
  const { type, payload = {} } = action;

  switch (type) {
    case types.UPDATE_TASKS_TAB: {
      const { tabIndex } = payload;
      return { ...state, tabIndex };
    }

    default:
      return state;
  }
}

import * as types from '../actions/actionTypes';
import _ from 'underscore';

const initialState = {
  tabIndex: 0,
};

export default function navigate(state = initialState, action) {
  const { type, payload = {} } = action;

  switch (type) {
    case types.UPDATE_NAVIGATE_TAB: {
      const { tabIndex } = payload
      return { ...state, tabIndex };
    }

    default:
      return state;
  }
}

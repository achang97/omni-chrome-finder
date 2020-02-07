import * as types from '../actions/actionTypes';
import _ from 'underscore';

const initialState = {
  showDescriptionEditor: false,
};

export default function create(state = initialState, action) {
  const { type, payload = {} } = action;

  switch (type) {
    case types.SHOW_DESCRIPTION_EDITOR: {
      return { ...state, showDescriptionEditor: true };
    }

    default:
      return state;
  }
}

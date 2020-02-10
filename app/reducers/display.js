import * as types from '../actions/actionTypes';
import _ from 'underscore';

const initialState = {
  dockVisible: false,
  dockExpanded: false,
};

export default function display(state = initialState, action) {
  const { type, payload = {} } = action;

  switch (type) {
    case types.TOGGLE_DOCK: {
      return { ...state, dockVisible: !state.dockVisible, dockExpanded: !state.dockVisible ? false : state.dockExpanded };
    }
    case types.EXPAND_DOCK: {
      return { ...state, dockExpanded: true };
    }

    default:
      return state;
  }
}

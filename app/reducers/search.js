import * as types from '../actions/actionTypes';
import { SEARCH_TYPES } from '../utils/constants';
import _ from 'underscore';

const initialState = {
  [SEARCH_TYPES.SIDEBAR]: {
    cards: [],
  },
  [SEARCH_TYPES.POPOUT]: {
    cards: [],
  }
};

export default function navigate(state = initialState, action) {
  const { type, payload = {} } = action;

  switch (type) {
    case types.SEARCH_CARDS_REQUEST: {
      const { type, query } = payload;
      return { ...state, [type]: { ...state[type], isSearching: true, searchError: null } };
    }
    case types.SEARCH_CARDS_SUCCESS: {
      const { type, cards } = payload;
      return { ...state, [type]: { ...state[type], isSearching: false, cards } };
    }
    case types.SEARCH_CARDS_ERROR: {
      const { type, error } = payload;
      return { ...state, [type]: { ...state[type], isSearching: false, searchError: error } };
    }

    default:
      return state;
  }
}

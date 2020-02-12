import * as types from '../actions/actionTypes';
import { removeIndex } from '../utils/arrayHelpers';
import _ from 'underscore';

const initialState = {
  tabIndex: 0,
  filterTags: [],
};

export default function navigate(state = initialState, action) {
  const { type, payload = {} } = action;

  switch (type) {
    case types.UPDATE_NAVIGATE_TAB: {
      const { tabIndex } = payload;
      return { ...state, tabIndex };
    }

    case types.UPDATE_FILTER_TAGS: {
      const { newTags } = payload;
      return { ...state, filterTags: newTags };
    }
    case types.REMOVE_FILTER_TAG: {
      const { index } = payload;
      const { filterTags } = state;
      return { ...state, filterTags: removeIndex(filterTags, index) };
    }

    default:
      return state;
  }
}

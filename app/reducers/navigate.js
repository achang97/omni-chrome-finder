import * as types from '../actions/actionTypes';
import { removeIndex } from '../utils/arrayHelpers';
import { NAVIGATE_TAB_OPTION } from '../utils/constants';
import _ from 'underscore';

const initialState = {
  activeTab: NAVIGATE_TAB_OPTION.ALL,
  searchText: '',
  filterTags: [],
};

export default function navigate(state = initialState, action) {
  const { type, payload = {} } = action;

  switch (type) {
    case types.UPDATE_NAVIGATE_TAB: {
      const { activeTab } = payload;
      return { ...state, activeTab };
    }

    case types.UPDATE_NAVIGATE_SEARCH_TEXT: {
      const { text } = payload;
      return { ...state, searchText: text };
    }

    case types.UPDATE_FILTER_TAGS: {
      const { newTags } = payload;
      return { ...state, filterTags: newTags || []};
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

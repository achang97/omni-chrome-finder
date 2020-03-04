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
      const { activeTab: newTab } = payload;

      if (newTab === state.activeTab) {
        return state;
      }

      // Clear all information on change
      return { ...state, activeTab: newTab, searchText: '', filterTags: [] };
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

    case types.DELETE_NAVIGATE_CARD_REQUEST: {
      return { ...state, isDeletingCard: true, deleteError: null }
    }
    case types.DELETE_NAVIGATE_CARD_SUCCESS: {
      return { ...state, isDeletingCard: false }
    }
    case types.DELETE_NAVIGATE_CARD_ERROR: {
      const { error } = payload;
      return { ...state, isDeletingCard: false, deleteError: error }
    }

    default:
      return state;
  }
}

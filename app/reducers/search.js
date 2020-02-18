import * as types from '../actions/actionTypes';
import { SEARCH_TYPES } from '../utils/constants';
import _ from 'underscore';

const initialState = {
  [SEARCH_TYPES.SIDEBAR]: {
    cards: [],
  },
  [SEARCH_TYPES.POPOUT]: {
    cards: [],
  },

  tags: [],
  users: [],
  permissionGroups: [],
};

export default function navigate(state = initialState, action) {
  const { type, payload = {} } = action;

  switch (type) {
    case types.SEARCH_CARDS_REQUEST: {
      const { type, query } = payload;
      return { ...state, [type]: { ...state[type], isSearchingCards: true, searchCardsError: null } };
    }
    case types.SEARCH_CARDS_SUCCESS: {
      const { type, cards } = payload;
      return { ...state, [type]: { ...state[type], isSearchingCards: false, cards } };
    }
    case types.SEARCH_CARDS_ERROR: {
      const { type, error } = payload;
      return { ...state, [type]: { ...state[type], isSearchingCards: false, searchCardsError: error } };
    }

    case types.SEARCH_TAGS_REQUEST: {
      return { ...state, isSearchingTags: true, searchTagsError: null };
    }
    case types.SEARCH_TAGS_SUCCESS: {
      const { tags } = payload;
      return { ...state, isSearchingTags: false, tags };
    }
    case types.SEARCH_TAGS_ERROR: {
      const { error } = payload;
      return { ...state, isSearchingTags: false, searchTagsError: error };
    }

    case types.SEARCH_USERS_REQUEST: {
      return { ...state, isSearchingUsers: true, searchUsersError: null };
    }
    case types.SEARCH_USERS_SUCCESS: {
      const { users } = payload;
      return { ...state, isSearchingUsers: false, users };
    }
    case types.SEARCH_USERS_ERROR: {
      const { error } = payload;
      return { ...state, isSearchingUsers: false, searchUsersError: error };
    }

    case types.SEARCH_PERMISSION_GROUPS_REQUEST: {
      return { ...state, isSearchingPermissionGroups: true, searchPermissionGroupsError: null };
    }
    case types.SEARCH_PERMISSION_GROUPS_SUCCESS: {
      const { permissionGroups } = payload;
      return { ...state, isSearchingPermissionGroups: false, permissionGroups };
    }
    case types.SEARCH_PERMISSION_GROUPS_ERROR: {
      const { error } = payload;
      return { ...state, isSearchingPermissionGroups: false, searchPermissionGroupsError: error };
    }

    default:
      return state;
  }
}

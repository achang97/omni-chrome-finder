import * as types from '../actions/actionTypes';
import { SEARCH_TYPE } from '../utils/constants';
import _ from 'underscore';

const BASE_CARDS_STATE = {
  cards: [],
  externalResults: [],
  page: 0,
  hasReachedLimit: false,
}

const initialState = {
  cards: _.mapObject(SEARCH_TYPE, (val, key) => BASE_CARDS_STATE),
  tags: [],
  users: [],
  permissionGroups: [],
};

export default function navigate(state = initialState, action) {
  const { type, payload = {} } = action;

  switch (type) {
    case types.SEARCH_CARDS_REQUEST: {
      const { type, query, clearCards } = payload;
      return {
        ...state,
        cards: {
          ...state.cards,
          [type]: {
            ...(clearCards ? BASE_CARDS_STATE : state.cards[type]),
            isSearchingCards: true,
            searchCardsError: null
          }
        }
      };
    }
    case types.SEARCH_CARDS_SUCCESS: {
      const { type, cards, externalResults, clearCards } = payload;
      const currSearchState = state.cards[type];
      return {
        ...state,
        cards: {
          ...state.cards,
          [type]: {
            ...currSearchState,
            isSearchingCards: false,
            cards: clearCards ? cards : [...currSearchState.cards, ...cards],
            externalResults: externalResults || currSearchState.externalResults,
            page: clearCards ? 1 : currSearchState.page + 1,
            hasReachedLimit: cards.length === 0
          }          
        }
      };
    }
    case types.SEARCH_CARDS_ERROR: {
      const { type, error } = payload;
      return {
        ...state,
        cards: {
          ...state.cards,
          [type]: {
            ...state.cards[type],
            isSearchingCards: false,
            searchCardsError: error
          }
        }
      }
    }

    /* Operations that can be called from cards from Navigate tab */
    case types.DELETE_NAVIGATE_CARD_SUCCESS: {
      const { id } = payload;

      return {
        ...state,
        cards: {
          ...state.cards,
          [SEARCH_TYPE.NAVIGATE]: {
            ...state.cards[SEARCH_TYPE.NAVIGATE],
            cards: state.cards[SEARCH_TYPE.NAVIGATE].cards.filter(({ _id }) => _id !== id),
          }
        }
      }
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

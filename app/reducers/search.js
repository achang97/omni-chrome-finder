import _ from 'lodash';
import * as types from 'actions/actionTypes';
import { SEARCH } from 'appConstants';
import { updateArrayOfObjects } from 'utils/array';

const BASE_CARDS_STATE = {
  cards: [],
  page: 0,
  hasReachedLimit: false
};

const INITIAL_CARDS_STATE = {};
Object.values(SEARCH.SOURCE).forEach((type) => {
  INITIAL_CARDS_STATE[type] = BASE_CARDS_STATE;
});

const INITIAL_INTEGRATIONS_STATE = {};
SEARCH.INTEGRATIONS.forEach(({ type }) => {
  INITIAL_INTEGRATIONS_STATE[type] = [];
});

const initialState = {
  cards: INITIAL_CARDS_STATE,
  nodes: [],
  integrations: INITIAL_INTEGRATIONS_STATE,
  tags: [],
  users: [],
  permissionGroups: []
};

export default function searchReducer(state = initialState, action) {
  const { type, payload = {} } = action;

  const updateCardStateBySource = (searchType, updateFn) => ({
    ...state,
    cards: {
      ...state.cards,
      [searchType]: { ...state.cards[searchType], ...updateFn(state.cards[searchType]) }
    }
  });

  const updateAllCards = (updateCardsFn) => ({
    ...state,
    cards: _.mapValues(state.cards, (val) => ({
      ...val,
      cards: updateCardsFn(val.cards)
    }))
  });

  switch (type) {
    case types.SEARCH_CARDS_REQUEST: {
      const { source, query, clearCards } = payload;
      return updateCardStateBySource(source, (cardState) => ({
        ...(clearCards ? BASE_CARDS_STATE : {}),
        isSearchingCards: true,
        searchCardsError: null,
        oldQuery: query || cardState.query
      }));
    }
    case types.SEARCH_CARDS_SUCCESS: {
      const { source, cards, searchLogId, clearCards } = payload;
      return updateCardStateBySource(source, (cardState) => ({
        isSearchingCards: false,
        cards: clearCards ? cards : _.unionBy(cardState.cards, cards, '_id'),
        page: clearCards ? 1 : cardState.page + 1,
        hasReachedLimit: cards.length === 0 || cards.length < SEARCH.PAGE_SIZE,
        searchLogId
      }));
    }
    case types.SEARCH_CARDS_ERROR: {
      const { source, error } = payload;
      return updateCardStateBySource(source, () => ({
        isSearchingCards: false,
        searchCardsError: error
      }));
    }

    case types.CLEAR_SEARCH_CARDS: {
      const { source } = payload;
      return updateCardStateBySource(source, () => BASE_CARDS_STATE);
    }

    case types.UPDATE_SEARCH_CARD: {
      const { card } = payload;
      return updateAllCards((cards) =>
        cards.map((currCard) => (currCard._id === card._id ? card : currCard))
      );
    }
    case types.REMOVE_SEARCH_CARDS: {
      const { cardIds } = payload;
      return updateAllCards((cards) => cards.filter(({ _id }) => !cardIds.includes(_id)));
    }

    case types.SEARCH_NODES_SUCCESS: {
      const { nodes } = payload;
      return { ...state, nodes };
    }

    case types.UPDATE_SEARCH_NODE: {
      const { node } = payload;
      return {
        ...state,
        nodes: state.nodes.map((currNode) => (currNode._id === node._id ? node : currNode))
      };
    }
    case types.REMOVE_SEARCH_NODES: {
      const { nodeIds } = payload;
      return { ...state, nodes: state.nodes.filter(({ _id }) => !nodeIds.includes(_id)) };
    }

    case types.SEARCH_INTEGRATIONS_REQUEST: {
      return {
        ...state,
        isSearchingIntegrations: true,
        searchIntegrationsError: null,
        integrations: INITIAL_INTEGRATIONS_STATE
      };
    }
    case types.SEARCH_INDIVIDUAL_INTEGRATION_SUCCESS: {
      const { integration, items } = payload;
      return {
        ...state,
        integrations: { ...state.integrations, [integration]: items }
      };
    }
    case types.SEARCH_INTEGRATIONS_SUCCESS: {
      return { ...state, isSearchingIntegrations: false, hasSearchedIntegrations: true };
    }
    case types.SEARCH_INTEGRATIONS_ERROR: {
      const { error } = payload;
      return { ...state, isSearchingIntegrations: false, searchIntegrationsError: error };
    }

    case types.UPDATE_SEARCH_INTEGRATION_RESULT: {
      const { integration, matchParams, update } = payload;
      const { integrations } = state;
      return {
        ...state,
        integrations: {
          ...integrations,
          [integrations]: updateArrayOfObjects(integrations[integration], matchParams, update)
        }
      };
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

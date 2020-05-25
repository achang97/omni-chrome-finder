import _ from 'lodash';
import * as types from 'actions/actionTypes';
import { SEARCH } from 'appConstants';

const BASE_CARDS_STATE = {
  cards: [],
  externalResults: [],
  page: 0,
  hasReachedLimit: false
};

const initialState = {
  cards: _.mapValues(SEARCH.TYPE, () => BASE_CARDS_STATE),
  nodes: [], // TODO: make this take a type
  tags: [],
  users: [],
  permissionGroups: []
};

export default function searchReducer(state = initialState, action) {
  const { type, payload = {} } = action;

  const updateCardStateByType = (searchType, updateFn) => ({
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
      const { type: searchType, query, clearCards } = payload;
      return updateCardStateByType(searchType, (cardState) => ({
        ...(clearCards ? BASE_CARDS_STATE : {}),
        isSearchingCards: true,
        searchCardsError: null,
        oldQuery: query || cardState.query
      }));
    }
    case types.SEARCH_CARDS_SUCCESS: {
      const { type: searchType, cards, externalResults, clearCards } = payload;
      return updateCardStateByType(searchType, (cardState) => ({
        isSearchingCards: false,
        cards: clearCards ? cards : _.unionBy(cardState.cards, cards, '_id'),
        externalResults: externalResults || cardState.externalResults,
        page: clearCards ? 1 : cardState.page + 1,
        hasReachedLimit: cards.length === 0 || cards.length < SEARCH.PAGE_SIZE
      }));
    }
    case types.SEARCH_CARDS_ERROR: {
      const { type: searchType, error } = payload;
      return updateCardStateByType(searchType, () => ({
        isSearchingCards: false,
        searchCardsError: error
      }));
    }

    case types.CLEAR_SEARCH_CARDS: {
      const { type: searchType } = payload;
      return updateCardStateByType(searchType, () => BASE_CARDS_STATE);
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

    case types.SEARCH_NODES_REQUEST: {
      return { ...state, isSearchingNodes: true, searchNodesError: null };
    }
    case types.SEARCH_NODES_SUCCESS: {
      const { nodes } = payload;
      return { ...state, isSearchingNodes: false, nodes };
    }
    case types.SEARCH_NODES_ERROR: {
      const { error } = payload;
      return { ...state, isSearchingNodes: false, searchNodesError: error };
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

import _ from 'lodash';
import * as types from '../actions/actionTypes';
import { SEARCH_TYPE } from '../utils/constants';

const BASE_CARDS_STATE = {
  cards: [],
  externalResults: [],
  page: 0,
  hasReachedLimit: false,
};

const initialState = {
  cards: _.mapValues(SEARCH_TYPE, () => BASE_CARDS_STATE),
  tags: [],
  users: [],
  permissionGroups: [],
};

export default function navigateReducer(state = initialState, action) {
  const updateCardStateByType = (type, updateFn) => ({
    ...state,
    cards: {
      ...state.cards,
      [type]: { ...state.cards[type], ...updateFn(state.cards[type]) }
    }
  });

  const updateAllCards = updateCardsFn => ({
    ...state,
    cards: _.mapValues(state.cards, val => ({
      ...val,
      cards: updateCardsFn(val.cards)
    }))
  });

  const removeCard = (cards, cardId) => cards.filter(({ _id }) => _id !== cardId);

  const removeCardByType = (type, cardId) => updateCardStateByType(type, cardState => ({
    cards: removeCard(cardState.cards, cardId)
  }));

  const { type, payload = {} } = action;

  switch (type) {
    case types.SEARCH_CARDS_REQUEST: {
      const { type: searchType, clearCards } = payload;
      return updateCardStateByType(searchType, () => ({
        ...(clearCards ? BASE_CARDS_STATE : {}),
        isSearchingCards: true,
        searchCardsError: null
      }));
    }
    case types.SEARCH_CARDS_SUCCESS: {
      const { type: searchType, cards, externalResults, clearCards } = payload;
      return updateCardStateByType(searchType, cardState => ({
        isSearchingCards: false,
        cards: clearCards ? cards : _.unionBy(cardState.cards, cards, '_id'),
        externalResults: externalResults || cardState.externalResults,
        page: clearCards ? 1 : cardState.page + 1,
        hasReachedLimit: cards.length === 0
      }));
    }
    case types.SEARCH_CARDS_ERROR: {
      const { type: searchType, error } = payload;
      return updateCardStateByType(searchType, () => ({
        isSearchingCards: false,
        searchCardsError: error
      }));
    }

    // Update Cards
    case types.UPDATE_CARD_SUCCESS:
    case types.MARK_OUT_OF_DATE_SUCCESS:
    case types.MARK_UP_TO_DATE_SUCCESS: {
      const { card } = payload;
      return updateAllCards(cards => cards.map(currCard => (
        currCard._id === card._id ? card : currCard
      )));
    }

    // Add Cards
    case types.ADD_SEARCH_CARD: {
      const { card } = payload;
      return updateCardStateByType(SEARCH_TYPE.NAVIGATE, cardState => ({
        cards: _.unionBy(cardState.cards, [card], '_id')
      }));
    }

    // Operations that can be called from cards from Navigate tab
    case types.DELETE_CARD_SUCCESS: {
      const { cardId } = payload;
      return updateAllCards(cards => removeCard(cards, cardId));
    }
    case types.DELETE_NAVIGATE_CARD_SUCCESS: {
      const { id } = payload;
      return removeCardByType(SEARCH_TYPE.NAVIGATE, id);
    }
    case types.REMOVE_SEARCH_CARD: {
      const { cardId } = payload;
      return removeCardByType(SEARCH_TYPE.NAVIGATE, cardId);
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

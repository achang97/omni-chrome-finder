import { setStorage } from '../utils/storage';
import { NAVIGATE_TAB_OPTION } from '../utils/constants';
import * as types from '../actions/actionTypes';
import { addSearchCard, updateSearchCard, removeSearchCard } from '../actions/search';

const cardsMiddleware = store => next => (action) => {
  const { type, payload } = action;

  const activeNavigateTab = store.getState().navigate.activeTab;

  switch (type) {
    // Update cards
    case types.UPDATE_CARD_SUCCESS:
    case types.MARK_OUT_OF_DATE_SUCCESS:
    case types.MARK_UP_TO_DATE_SUCCESS:
    case types.APPROVE_CARD_SUCCESS:
    case types.MARK_UP_TO_DATE_FROM_TASKS_SUCCESS: 
    case types.APPROVE_CARD_FROM_TASKS_SUCCESS: {
      const { card } = payload;
      store.dispatch(updateSearchCard(card));
      break;
    }

    // Add cards
    case types.CREATE_CARD_SUCCESS: 
    case types.ADD_BOOKMARK_SUCCESS: {
      const { card } = payload;
      if ((type === types.CREATE_CARD_SUCCESS && activeNavigateTab === NAVIGATE_TAB_OPTION.MY_CARDS) ||
        (type === types.ADD_BOOKMARK_SUCCESS && activeNavigateTab === NAVIGATE_TAB_OPTION.BOOKMARKED)) {
        store.dispatch(addSearchCard(card));
      }
      break;
    }

    // Remove cards
    case types.DELETE_CARD_SUCCESS:
    case types.DELETE_NAVIGATE_CARD_SUCCESS:
    case types.REMOVE_BOOKMARK_SUCCESS: {
      const { cardId } = payload;
      if (type !== types.REMOVE_BOOKMARK_SUCCESS || activeNavigateTab === NAVIGATE_TAB_OPTION.BOOKMARKED) {
        store.dispatch(removeSearchCard(cardId));
      }
      break;
    }

    default: {
      break;
    }
  }

  return next(action);
};

export default cardsMiddleware;

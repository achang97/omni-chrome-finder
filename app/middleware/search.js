import * as types from 'actions/actionTypes';
import {
  updateSearchCard,
  removeSearchCards,
  removeSearchNodes,
  updateSearchNode
} from 'actions/search';

const cardsMiddleware = (store) => (next) => (action) => {
  const nextAction = next(action);
  const { type, payload } = action;

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

    case types.UPDATE_FINDER_FOLDER_SUCCESS: {
      const { folder } = payload;
      store.dispatch(updateSearchNode(folder));
      break;
    }

    // Remove cards
    case types.DELETE_CARD_SUCCESS: {
      const { cardId } = payload;
      store.dispatch(removeSearchCards([cardId]));
      break;
    }
    case types.DELETE_FINDER_NODES_SUCCESS: {
      const { cardIds, nodeIds } = payload;
      store.dispatch(removeSearchCards(cardIds));
      store.dispatch(removeSearchNodes(nodeIds));
      break;
    }

    default: {
      break;
    }
  }

  return nextAction;
};

export default cardsMiddleware;

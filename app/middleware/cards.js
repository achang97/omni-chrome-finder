import * as types from 'actions/actionTypes';
import { handleDeleteCardSuccess, updateCard, requestGetCard } from 'actions/cards';

const cardsMiddleware = (store) => (next) => (action) => {
  const nextAction = next(action);
  const { type, payload } = action;

  switch (type) {
    // Handle tasks actions
    case types.MARK_UP_TO_DATE_FROM_TASKS_SUCCESS:
    case types.APPROVE_CARD_FROM_TASKS_SUCCESS: {
      const { card } = payload;
      store.dispatch(updateCard(card));
      break;
    }

    // Handle navigate actions
    case types.DELETE_NAVIGATE_CARD_SUCCESS: {
      const { cardId } = payload;
      store.dispatch(handleDeleteCardSuccess(cardId));
      break;
    }

    // Handle actions from card itself
    case types.CANCEL_EDIT_CARD: {
      store.dispatch(requestGetCard());
      break;
    }

    default: {
      break;
    }
  }

  return nextAction;
};

export default cardsMiddleware;

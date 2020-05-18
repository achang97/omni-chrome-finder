import * as types from 'actions/actionTypes';
import {
  updateCard,
  handleDeleteCardSuccess,
  requestGetCard,
  enableCardEditor,
  adjustCardDescriptionSectionHeight
} from 'actions/cards';
import { EDITOR_TYPE, DIMENSIONS } from 'appConstants/card';

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

    // Handle finder deletion actions
    case types.BULK_DELETE_FINDER_CARDS_SUCCESS: {
      const { cardIds } = payload;
      cardIds.forEach((cardId) => {
        store.dispatch(handleDeleteCardSuccess(cardId));
      })
      break;
    }

    // Handle actions from card itself
    case types.CANCEL_EDIT_CARD: {
      store.dispatch(requestGetCard());
      break;
    }
    case types.EDIT_CARD: {
      store.dispatch(enableCardEditor(EDITOR_TYPE.ANSWER));
      store.dispatch(adjustCardDescriptionSectionHeight(DIMENSIONS.MIN_QUESTION_HEIGHT));
      break;
    }

    default: {
      break;
    }
  }

  return nextAction;
};

export default cardsMiddleware;

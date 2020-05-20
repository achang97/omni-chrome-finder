import * as types from 'actions/actionTypes';
import {
  updateCard,
  handleDeleteCardSuccess,
  requestGetCard,
  enableCardEditor,
  adjustCardDescriptionSectionHeight
} from 'actions/cards';
import { closeFinder } from 'actions/finder';
import trackEvent from 'actions/analytics';
import { EDITOR_TYPE, DIMENSIONS } from 'appConstants/card';
import { MAIN_STATE_ID } from 'appConstants/finder';

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
    case types.DELETE_FINDER_NODES_SUCCESS: {
      const { cardIds } = payload;
      cardIds.forEach((cardId) => {
        store.dispatch(handleDeleteCardSuccess(cardId));
      });
      break;
    }

    // Handle actions from card itself
    case types.CLOSE_CARD: {
      const {
        cards: { cards },
        finder
      } = store.getState();

      const cardIds = cards.map(({ _id }) => _id);
      const finderIds = Object.keys(finder);

      finderIds.forEach((finderId) => {
        if (finderId !== MAIN_STATE_ID && !cardIds.includes(finderId)) {
          store.dispatch(closeFinder(finderId));
        }
      });
      break;
    }
    case types.CANCEL_EDIT_CARD: {
      store.dispatch(requestGetCard());
      break;
    }
    case types.EDIT_CARD: {
      const {
        cards: { activeCard }
      } = store.getState();
      store.dispatch(enableCardEditor(EDITOR_TYPE.ANSWER));
      store.dispatch(adjustCardDescriptionSectionHeight(DIMENSIONS.MIN_QUESTION_HEIGHT));
      store.dispatch(trackEvent('Click Edit Card', { 'Card ID': activeCard._id }));
      break;
    }

    default: {
      break;
    }
  }

  return nextAction;
};

export default cardsMiddleware;

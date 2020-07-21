import * as types from 'actions/actionTypes';
import { generateCardId } from 'utils/card';
import { CARD, FINDER } from 'appConstants';
import {
  BASE_CARD_STATE,
  INITIAL_STATE,
  getIndexById,
  getUpdatedCards,
  removeCardAtIndex,
  setActiveCardIndex,
  createCardEdits
} from './utils';

export default function cardWindowReducer(state, action) {
  const { type, payload = {} } = action;

  switch (type) {
    case types.UPDATE_CARD_WINDOW_POSITION: {
      const { position } = payload;
      return { ...state, windowPosition: position };
    }
    case types.ADJUST_CARDS_DIMENSIONS: {
      const { newWidth, newHeight } = payload;
      return { ...state, cardsWidth: newWidth, cardsHeight: newHeight };
    }
    case types.UPDATE_CARD_TAB_ORDER: {
      const { source, destination } = payload;

      const newCards = [...state.cards];
      const [removed] = newCards.splice(source.index, 1);
      newCards.splice(destination.index, 0, removed);

      return { ...state, cards: newCards, activeCardIndex: destination.index };
    }
    case types.TOGGLE_MAXIMIZE_CARDS: {
      return { ...state, cardsMaximized: !state.cardsMaximized };
    }
    case types.TOGGLE_CARDS: {
      return { ...state, cardsExpanded: !state.cardsExpanded };
    }

    case types.OPEN_FINDER: {
      const newState = state.showCards ? setActiveCardIndex(state, FINDER.TAB_INDEX) : state;
      return { ...newState, showCards: true, cardsExpanded: true };
    }
    case types.OPEN_CARD: {
      const { card, isNewCard, createModalOpen } = payload;

      if (!isNewCard) {
        const currIndex = getIndexById(state, card._id);
        if (currIndex !== -1) {
          return { ...setActiveCardIndex(state, currIndex), cardsExpanded: true };
        }
      }

      let cardInfo = { ...BASE_CARD_STATE, ...card };
      if (isNewCard) {
        cardInfo = createCardEdits({
          ...cardInfo,
          _id: generateCardId(),
          modalOpen: { ...cardInfo.modalOpen, [CARD.MODAL_TYPE.CREATE]: createModalOpen }
        });
      } else {
        cardInfo = { ...cardInfo, hasLoaded: false };
      }

      const newCards = [...getUpdatedCards(state), cardInfo];
      return {
        ...state,
        showCards: true,
        cards: newCards,
        activeCard: cardInfo,
        activeCardIndex: newCards.length - 1,
        cardsExpanded: true
      };
    }
    case types.SET_ACTIVE_CARD_INDEX: {
      const { index } = payload;
      return setActiveCardIndex(state, index);
    }
    case types.CLOSE_CARD: {
      const { index } = payload;
      return removeCardAtIndex(state, index);
    }

    case types.OPEN_CARD_CONTAINER_MODAL: {
      return { ...state, showCloseModal: true, cardsExpanded: true };
    }
    case types.CLOSE_CARD_CONTAINER_MODAL: {
      return { ...state, showCloseModal: false };
    }

    case types.CLOSE_ALL_CARDS: {
      return INITIAL_STATE;
    }

    default: {
      return null;
    }
  }
}

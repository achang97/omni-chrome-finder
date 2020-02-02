import * as types from '../actions/actionTypes';
import _ from 'underscore';

const initialState = {
  cards: [],
  activeCardIndex: -1,
};

const getNewCards = (id, newInfo, cards) => {
  const newCards = cards.map((card, i) => card.id === id ? { ...card, ...newInfo } : card);
  return newCards;
}

export default function cards(state = initialState, action) {
  const { type, payload = {} } = action;

  switch (type) {
    case types.OPEN_CARD: {
      const { id } = payload;
      const newCards = _.union(state.cards, [{ id, isEditing: false, sideDockOpen: false, createModalOpen: false, answerEditorState: {} }]);
      return { ...state, cards: newCards, activeCardIndex: newCards.length - 1 };
    }
    case types.SET_ACTIVE_CARD_INDEX: {
      const { index } = payload;
      return { ...state, activeCardIndex: index };
    }
    case types.CLOSE_CARD: {
      const { id } = payload;
      const newCards = state.cards.filter(({ id: cardId }) => cardId !== id);

      let activeCardIndex = state.activeCardIndex;
      if (newCards.length === 0) {
        activeCardIndex = -1;
      } else if (activeCardIndex >= newCards.length) {
        activeCardIndex = newCards.length - 1;
      }

      return { ...state, cards: newCards, activeCardIndex };
    }

    case types.OPEN_CARD_SIDE_DOCK: {
      const { id } = payload;
      const newCards = getNewCards(id, { sideDockOpen: true }, state.cards);
      return { ...state, cards: newCards };
    }
    case types.CLOSE_CARD_SIDE_DOCK: {
      const { id } = payload;
      const newCards = getNewCards(id, { sideDockOpen: false }, state.cards);
      return { ...state, cards: newCards };
    }

    case types.OPEN_CARD_CREATE_MODAL: {
      const { id } = payload;
      const newCards = getNewCards(id, { createModalOpen: true }, state.cards);
      return { ...state, cards: newCards };
    }
    case types.CLOSE_CARD_CREATE_MODAL: {
      const { id } = payload;
      const newCards = getNewCards(id, { createModalOpen: false }, state.cards);
      return { ...state, cards: newCards };
    }

    case types.EDIT_CARD: {
      const { id } = payload;
      const newCards = getNewCards(id, { isEditing: true }, state.cards);
      return { ...state, cards: newCards };
    }
    case types.SAVE_CARD: {
      const { id, answerState, descriptionState } = payload;
      const newCards = getNewCards(id, { answerEditorState: answerState, descriptionEditorState: descriptionState, isEditing: false }, state.cards);
      return { ...state, cards: newCards };
    }

    case types.CLOSE_ALL_CARDS: {
      return { ...state, cards: [], activeCardIndex: -1 };
    }

    default:
      return state;
  }
}

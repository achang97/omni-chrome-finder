import * as types from '../actions/actionTypes';
import _ from 'underscore';
import { EditorState } from 'draft-js';

const DESCRIPTION_EDITOR_TYPE = 'DESCRIPTION';
const ANSWER_EDITOR_TYPE = 'ANSWER';
const MIN_QUESTION_HEIGHT = 180;
const DEFAULT_CARDS_WIDTH = 660;
const DEFAULT_CARDS_HEIGHT = 500;

const THREAD_MODAL = 'THREAD_MODAL';
const THREAD_MODAL_EDIT = 'THREAD_MODAL_EDIT';

const initialState = {
  cards: [],
  cardsWidth: DEFAULT_CARDS_WIDTH,
  cardsHeight: DEFAULT_CARDS_HEIGHT,
  activeCardIndex: -1,
};

const getNewCards = (id, newInfo, cards) => {
  const newCards = cards.map((card, i) => card.id === id ? { ...card, ...newInfo } : card);
  return newCards;
}

const getNewCardsOnSave = (id, cards) => {
  const newCards = cards.map((card, i) => card.id === id ? {...card, ...{ isEditing: false, descriptionEditorStateSaved: card.descriptionEditorState, answerEditorStateSaved: card.answerEditorState }} : card);
  return newCards;
}

export default function cards(state = initialState, action) {
  const { type, payload = {} } = action;

  switch (type) {
    case types.OPEN_CARD: {
      const { id, question, descriptionEditorState, answerEditorState } = payload;

      const descriptionEditorStateSaved = EditorState.createEmpty();
      const answerEditorStateSaved = EditorState.createEmpty();

      const newCards = _.union(state.cards, 
        [{  id, 
            isEditing: false, 
            sideDockOpen: false, 
            createModalOpen: false, 
            question,
            descriptionEditorStateSaved: descriptionEditorStateSaved,
            answerEditorStateSaved: answerEditorStateSaved, 
            descriptionEditorState: descriptionEditorStateSaved, 
            answerEditorState: answerEditorStateSaved,
            descriptionEditorEnabled: false,
            answerEditorEnabled: false,
            descriptionSectionHeight: MIN_QUESTION_HEIGHT,
            showThreadModal: false,
            showThreadEditModal: false,

        }]);
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
    case types.ADJUST_CARDS_DIMENSIONS: {
      const { newWidth, newHeight } = payload;
      return { ...state, cardsWidth: newWidth, cardsHeight: newHeight };
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

    case types.CHANGE_ANSWER_EDITOR: {
      const { id, editorState } = payload;
      const newCards = getNewCards(id, { answerEditorState: editorState}, state.cards);
      return { ...state, cards: newCards };
    }

    case types.CHANGE_DESCRIPTION_EDITOR: {
      const { id, editorState } = payload;
      const newCards = getNewCards(id, { descriptionEditorState: editorState}, state.cards);
      return { ...state, cards: newCards };
    }

    case types.EDIT_CARD: {
      const { id } = payload;
      const newCards = getNewCards(id, { isEditing: true }, state.cards);
      return { ...state, cards: newCards };
    }
    case types.ENABLE_EDITOR: {
      const { id, editorType } = payload;
      const newCards = editorType === DESCRIPTION_EDITOR_TYPE ? getNewCards(id, { descriptionEditorEnabled: true }, state.cards) : getNewCards(id, { answerEditorEnabled: true }, state.cards);
      return { ...state, cards: newCards };
    }
    case types.DISABLE_EDITOR: {
      const { id, editorType } = payload;
      const newCards = editorType === DESCRIPTION_EDITOR_TYPE ? getNewCards(id, { descriptionEditorEnabled: false }, state.cards) : getNewCards(id, { answerEditorEnabled: false }, state.cards);
      return { ...state, cards: newCards };
    }
    case types.ADJUST_DESCRIPTION_SECTION_HEIGHT: {
      const { id, newHeight } = payload;
      const newCards = getNewCards(id, { descriptionSectionHeight: newHeight }, state.cards);
      return { ...state, cards: newCards };
    }
    case types.OPEN_MODAL: {
      const { id, modalType} = payload;
      const newCards = modalType === THREAD_MODAL ? getNewCards(id, {showThreadModal: true}, state.cards) : getNewCards(id, {showThreadEditModal: true}, state.cards);
      return { ...state, cards: newCards };
    }
    case types.CLOSE_MODAL: {
      const { id, modalType} = payload;
      const newCards = modalType === THREAD_MODAL ? getNewCards(id, {showThreadModal: false}, state.cards) : getNewCards(id, {showThreadEditModal: false}, state.cards);
      return { ...state, cards: newCards };
    }
    case types.SAVE_CARD: {
      const { id } = payload;
      const newCards = getNewCardsOnSave(id, state.cards);
      return { ...state, cards: newCards };
    }

    case types.CLOSE_ALL_CARDS: {
      return { ...state, cards: [], activeCardIndex: -1 };
    }

    default:
      return state;
  }
}

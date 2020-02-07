import * as types from '../actions/actionTypes';
import _ from 'underscore';
import { EditorState } from 'draft-js';
import { CARD_STATUS_OPTIONS } from '../utils/constants';

const DESCRIPTION_EDITOR_TYPE = 'DESCRIPTION';
const ANSWER_EDITOR_TYPE = 'ANSWER';
const MIN_QUESTION_HEIGHT = 180;
const DEFAULT_CARDS_WIDTH = 660;
const DEFAULT_CARDS_HEIGHT = 500;

const THREAD_MODAL = 'THREAD_MODAL';
const THREAD_MODAL_EDIT = 'THREAD_MODAL_EDIT';




const PLACEHOLDER_MESSAGES = [
  {
    senderName: 'Chetan Rane',
    message: 'Savings her pleased are several started females met. Short her not among being any. Thing of judge fruit charm views do. Miles mr an forty along as he. She education get middleton day agreement performed preserved unwilling. Do however as pleased offence outward beloved by present. By outward neither he so covered amiable greater. Juvenile proposal betrayed he an informed weddings followed. Precaution day see imprudence sympathize principles. At full leaf give quit to in they up.',
    time: 'Today at 3:52 PM',
    selected: true,
  },
  {
    senderName: 'Andrew Chang',
    message: 'What up bro how u doin',
    time: 'Today at 3:52 PM',
    selected: true,
  },
  {
    senderName: 'Chetan Rane',
    message: 'Savings her pleased are several started females met. Short her not among being any. Thing of judge fruit charm views do. Miles mr an forty along as he. She education get middleton day agreement performed preserved unwilling. Do however as pleased offence outward beloved by present. By outward neither he so covered amiable greater. Juvenile proposal betrayed he an informed weddings followed. Precaution day see imprudence sympathize principles. At full leaf give quit to in they up.',
    time: 'Today at 3:52 PM',
    selected: true,
  },
];

const initialState = {
  cards: [],
  cardsWidth: DEFAULT_CARDS_WIDTH,
  cardsHeight: DEFAULT_CARDS_HEIGHT,
  activeCardIndex: -1,

  createQuestion: '',
  createDescriptionEditorState: EditorState.createEmpty(),
  createAnswerEditorState: EditorState.createEmpty(),
};

const getNewCards = (id, newInfo, cards) => {
  const newCards = cards.map((card, i) => card.id === id ? { ...card, ...newInfo } : card);
  return newCards;
}

const getNewCardsOnSave = (id, cards) => {
  const newCards = cards.map((card, i) => card.id === id ? {...card, ...{ isEditing: false, questionSaved: card.question, descriptionEditorStateSaved: card.descriptionEditorState, answerEditorStateSaved: card.answerEditorState }} : card);
  return newCards;
}

const getNewCardsOnSaveMessages = (id, cards) => {
  const newCards = cards.map((card, i) => card.id === id ? {...card, ...{ showThreadEditModal: false, selectedMessagesSaved: card.selectedMessages }} : card);
  return newCards;
}

export default function cards(state = initialState, action) {
  const { type, payload = {} } = action;

  switch (type) {
    case types.OPEN_CARD: {
      const { id, createModalOpen=false, descriptionEditorState, answerEditorState, fromCreate=false } = payload;

      var descriptionEditorStateSaved = descriptionEditorState || EditorState.createEmpty();
      var answerEditorStateSaved = answerEditorState || EditorState.createEmpty();


      const questionSaved = '';
      // If Open Card is being called from Create, set properties to editing
      var isEditing = false;
      var answerEditorEnabled = false;
      var cardStatus = CARD_STATUS_OPTIONS.UP_TO_DATE;
      var question = questionSaved;

      if (fromCreate) {
        isEditing = true;
        answerEditorEnabled = true;
        descriptionEditorStateSaved = state.createDescriptionEditorState;
        answerEditorStateSaved = state.createAnswerEditorState;
        cardStatus = CARD_STATUS_OPTIONS.NOT_DOCUMENTED;
        question = state.createQuestion;
      }

      const newCards = _.union(state.cards, 
        [{  id, 
            isEditing: isEditing, 
            sideDockOpen: false, 
            createModalOpen, 

            question: question,
            questionSaved: questionSaved,

            descriptionEditorStateSaved: descriptionEditorStateSaved,
            answerEditorStateSaved: answerEditorStateSaved, 
            descriptionEditorState: descriptionEditorStateSaved, 
            answerEditorState: answerEditorStateSaved,
            descriptionEditorEnabled: false,
            answerEditorEnabled: answerEditorEnabled,
            descriptionSectionHeight: MIN_QUESTION_HEIGHT,
            showThreadModal: false,
            showThreadEditModal: false,
            selectedMessages: PLACEHOLDER_MESSAGES.map(msg => msg.selected),
            selectedMessagesSaved: PLACEHOLDER_MESSAGES.map(msg => msg.selected),


            cardStatus: cardStatus,
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

    case types.CHANGE_QUESTION: {
      const { id, newValue } = payload;
      const newCards = getNewCards(id, { question: newValue }, state.cards);
      return {...state, cards: newCards };
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

    // Create Editors
    case types.CHANGE_CREATE_QUESTION: {
      const { newValue } = payload;
      return { ...state, createQuestion: newValue };
    }
    case types.CHANGE_CREATE_ANSWER_EDITOR: {
      const { editorState } = payload;
      return { ...state, createAnswerEditorState: editorState };
    }
    case types.CHANGE_CREATE_DESCRIPTION_EDITOR: {
      const { editorState } = payload;
      return { ...state, createDescriptionEditorState: editorState };
    }
    case types.CLEAR_CREATE_PANEL: {
      return { ...state, createQuestion: '', createAnswerEditorState: EditorState.createEmpty(), createDescriptionEditorState: EditorState.createEmpty() };
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
    case types.TOGGLE_SELECTED_MESSAGE: {
      const { id, messageIndex } = payload;
      var newSelectedMessages = state.cards.find(card => { return card.id === id } ).selectedMessages;
      newSelectedMessages[messageIndex] = !newSelectedMessages[messageIndex]
      const newCards = getNewCards(id, { selectedMessages: newSelectedMessages }, state.cards);
      return { ...state, cards: newCards };
    }
    case types.OPEN_MODAL: {
      const { id, modalType} = payload;
      const newCards = modalType === THREAD_MODAL ? getNewCards(id, {showThreadModal: true}, state.cards) : getNewCards(id, {showThreadEditModal: true}, state.cards);
      return { ...state, cards: newCards };
    }
    case types.CLOSE_MODAL: {
      const { id, modalType} = payload;
      let newCards;
      if (modalType === THREAD_MODAL) {
        newCards = getNewCards(id, {showThreadModal: false}, state.cards);
      } else if (modalType === THREAD_MODAL_EDIT) {
        // Restore messages state to saved state
         const selectedMessagesSaved = state.cards.find(card => { return card.id === id } ).selectedMessagesSaved;
         newCards = getNewCards(id, {selectedMessages: selectedMessagesSaved , showThreadEditModal: false}, state.cards);
      }
      return { ...state, cards: newCards };
    }
    case types.CHANGE_CARD_STATUS: {
      const { id, newStatus } = payload;
      const newCards = getNewCards(id, { cardStatus: newStatus }, state.cards);
      return { ...state, cards: newCards };
    }
    case types.SAVE_CARD: {
      const { id } = payload;
      const newCards = getNewCardsOnSave(id, state.cards);
      return { ...state, cards: newCards };
    }
    case types.SAVE_MESSAGES: {
      const { id } = payload;
      const newCards = getNewCardsOnSaveMessages(id, state.cards);
      return { ...state, cards: newCards };
    }

    case types.CLOSE_ALL_CARDS: {
      return { ...state, cards: [], activeCardIndex: -1 };
    }

    default:
      return state;
  }
}

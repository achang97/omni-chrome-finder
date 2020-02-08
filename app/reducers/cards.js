import * as types from '../actions/actionTypes';
import _ from 'underscore';
import { EditorState } from 'draft-js';
import { removeIndex, updateIndex } from '../utils/arrayHelpers';
import { CARD_STATUS_OPTIONS, DESCRIPTION_EDITOR_TYPE, ANSWER_EDITOR_TYPE, MIN_QUESTION_HEIGHT, DEFAULT_CARDS_WIDTH, DEFAULT_CARDS_HEIGHT, THREAD_MODAL, THREAD_MODAL_EDIT } from '../utils/constants';

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
  activeCard: {},

  createQuestion: '',
  createDescriptionEditorState: EditorState.createEmpty(),
  createAnswerEditorState: EditorState.createEmpty(),
};


export default function cards(state = initialState, action) {
  const { type, payload = {} } = action;

  const updateActiveCard = (newInfo) => {
    return { ...state, activeCard: { ...state.activeCard, ...newInfo } };
  }

  const getUpdatedCards = () => {
    const { activeCardIndex, cards, activeCard } = state;
    return updateIndex(cards, activeCardIndex, activeCard);
  }

  switch (type) {
    case types.OPEN_CARD: {
      const { id, createModalOpen=false, descriptionEditorState, answerEditorState, fromCreate=false } = payload;
      const { cards, activeCardIndex, createDescriptionEditorState, createAnswerEditorState } = state;

      let descriptionEditorStateSaved = (fromCreate ? createDescriptionEditorState : descriptionEditorState) || EditorState.createEmpty();
      let answerEditorStateSaved = (fromCreate ? createAnswerEditorState : answerEditorState) || EditorState.createEmpty();

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

      // Check if card is already open
      if (!fromCreate && cards.find(({ id: currId }) => currId === id)) {
        return state;
      }

      const newCard = {
        id: fromCreate ? `new-card-${cards.length}` : id, // assign temp ID
        isEditing: isEditing, 
        sideDockOpen: false, 
        createModalOpen: false, 
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
      };

      let newCards = activeCardIndex === -1 ? [] : getUpdatedCards();
      newCards = [...newCards, newCard];

      return { ...state, cards: newCards, activeCard: newCard, activeCardIndex: newCards.length - 1 };

    }
    case types.SET_ACTIVE_CARD_INDEX: {
      const { index } = payload;
      const { activeCard, activeCardIndex, cards } = state;

      if (index === activeCard) {
        return state;
      }

      return {...state, activeCardIndex: index, activeCard: cards[index], cards: getUpdatedCards() };
    }
    case types.CLOSE_CARD: {
      const { index } = payload;
      const newCards = removeIndex(state.cards, index);

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
      return updateActiveCard({ sideDockOpen: true });
    }
    case types.CLOSE_CARD_SIDE_DOCK: {
      return updateActiveCard({ sideDockOpen: false });
    }

    case types.OPEN_CARD_CREATE_MODAL: {
      return updateActiveCard({ createModalOpen: true });
    }
    case types.CLOSE_CARD_CREATE_MODAL: {
      return updateActiveCard({ createModalOpen: false });
    }

    case types.CHANGE_QUESTION: {
      const { id, newValue } = payload;
      const newCards = getNewCards(id, { question: newValue }, state.cards);
      return {...state, cards: newCards };
    }
    case types.CHANGE_ANSWER_EDITOR: {
      const { editorState } = payload;
      return updateActiveCard({ answerEditorState: editorState });
    }
    case types.CHANGE_DESCRIPTION_EDITOR: {
      const { editorState } = payload;
      return updateActiveCard({ descriptionEditorState: editorState });
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
      return updateActiveCard({ isEditing: true });
    }
    case types.SAVE_CARD: {
      // Edits will likely be made to this case when connecting to the backend.
      const { activeCard } = state;
      const newCardState = updateActiveCard({ isEditing: false, descriptionEditorStateSaved: activeCard.descriptionEditorState, answerEditorStateSaved: activeCard.answerEditorState });
      return { ...newCardState, cards: getUpdatedCards() };
    }

    case types.ENABLE_EDITOR: {
      const { editorType } = payload;
      const newInfo = editorType === DESCRIPTION_EDITOR_TYPE ? { descriptionEditorEnabled: true } : { answerEditorEnabled: true };
      return updateActiveCard(newInfo);
    }
    case types.DISABLE_EDITOR: {
      const { editorType } = payload;
      const newInfo = editorType === DESCRIPTION_EDITOR_TYPE ? { descriptionEditorEnabled: false } : { answerEditorEnabled: false };
      return updateActiveCard(newInfo);
    }

    case types.ADJUST_DESCRIPTION_SECTION_HEIGHT: {
      const { newHeight } = payload;
      return updateActiveCard({ descriptionSectionHeight: newHeight });
    }
    case types.TOGGLE_SELECTED_MESSAGE: {
      const { messageIndex } = payload;
      const { activeCard } = state;
      
      const newSelectedMessages = activeCard.selectedMessages;
      newSelectedMessages[messageIndex] = !newSelectedMessages[messageIndex];
      
      return updateActiveCard({ selectedMessages: newSelectedMessages });
    }

    case types.OPEN_MODAL: {
      const { modalType} = payload;
      const newInfo = modalType === THREAD_MODAL ? {showThreadModal: true} : {showThreadEditModal: true};
      return updateActiveCard(newInfo);
    }
    case types.CLOSE_MODAL: {
      const { modalType} = payload;
      const { activeCard } = state;
      const newInfo = modalType === THREAD_MODAL ?
        {showThreadModal: false} :
        {selectedMessages: activeCard.selectedMessagesSaved, showThreadEditModal: false};
      return updateActiveCard(newInfo);
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
      const { activeCard } = state;
      return updateActiveCard({ showThreadEditModal: false, selectedMessagesSaved: activeCard.selectedMessages });
    }

    case types.CLOSE_ALL_CARDS: {
      return { ...state, cards: [], activeCardIndex: -1, activeCard: {} };
    }

    default:
      return state;
  }
}

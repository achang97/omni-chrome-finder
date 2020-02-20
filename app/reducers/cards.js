import * as types from '../actions/actionTypes';
import _ from 'underscore';
import { EditorState } from 'draft-js';
import { removeIndex, updateIndex } from '../utils/arrayHelpers';
import { convertCardToFrontendFormat } from '../utils/cardHelpers';
import { CARD_STATUS_OPTIONS, EDITOR_TYPE, CARD_DIMENSIONS, MODAL_TYPE, VERIFICATION_INTERVAL_OPTIONS, PERMISSION_OPTIONS } from '../utils/constants';

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
  cardsWidth: CARD_DIMENSIONS.DEFAULT_CARDS_WIDTH,
  cardsHeight: CARD_DIMENSIONS.DEFAULT_CARDS_HEIGHT,
  activeCardIndex: -1,
  activeCard: {},
  showCloseModal: false,
};

const BASE_MODAL_OPEN_STATE = _.mapObject(MODAL_TYPE, (val, key) => false);

const BASE_CARD_STATE = {
  isEditing: false, 
  sideDockOpen: false, 
  modalOpen: BASE_MODAL_OPEN_STATE,
  editorEnabled: { [EDITOR_TYPE.DESCRIPTION]: false, [EDITOR_TYPE.ANSWER]: false },
  descriptionSectionHeight: CARD_DIMENSIONS.MIN_QUESTION_HEIGHT,
  edits: {},
  hasLoaded: true,
}

export default function cards(state = initialState, action) {
  const { type, payload = {} } = action;

  /* General helpers */
  const getIndexWithId = (id) => {
    return state.cards.findIndex(card => card._id === id);
  }

  const getCardWithId = (id) => {
    const { activeCard, cards } = state;
    if (id === activeCard._id) {
      return activeCard;
    }

    const index = getIndexWithId(id);
    if (index === -1) {
      return null;
    } else {
      return cards[index];
    }
  }

  /* Edit Card helper functions */
  const updateActiveCard = (newInfo, newEditsInfo={}) => {
    return { ...state, activeCard: { ...state.activeCard, ...newInfo, edits: { ...state.activeCard.edits, ...newEditsInfo } } };
  }

  const updateActiveCardEdits = (newEditsInfo) => {
    return updateActiveCard({}, newEditsInfo);
  }

  const updateCardWithId = (id, newInfo, updateCardsArray=false) => {
    // TODO FIX
    if (id === state.activeCard._id && !updateCardsArray) {
      return updateActiveCard(newInfo);
    } else if (id === state.activeCard._id && updateCardsArray) {
      const newActiveCard = { ...state.activeCard, ...newInfo };
      return {
        ...state,
        activeCard: newActiveCard,
        cards: state.cards.map(card => card._id === id ? newActiveCard : card ),
      };
    } else {
      return {
        ...state,
        cards: state.cards.map(card => card._id === id ? { ...card, ...newInfo } : card )
      };
    }
  }

  const createActiveCardEdits = (card) => {
    const { owners, attachments, tags, keywords, permissions, permissionGroups, verificationInterval, question, answerEditorState, descriptionEditorState, messages } = card;
    return {
      ...card,
      isEditing: true,
      edits: { owners, attachments, tags, keywords, permissions, permissionGroups, verificationInterval, question, answerEditorState, descriptionEditorState, messages }
    };
  }

  const getUpdatedCards = () => {
    const { activeCardIndex, cards, activeCard } = state;
    return updateIndex(cards, activeCardIndex, activeCard);
  }

  /* Card removal functions */
  const removeCardAtIndex = (index) => {
    const { activeCardIndex, cards, activeCard } = state;

    const newCards = removeIndex(cards, index);

    if (newCards.length === 0) {
      return initialState;
    }

    const isClosingActiveCard = index === activeCardIndex;

    let newActiveCardIndex = activeCardIndex;
    if (newActiveCardIndex >= newCards.length) {
      newActiveCardIndex = newCards.length - 1;
    }

    const newActiveCard = isClosingActiveCard ? newCards[newActiveCardIndex] : activeCard;

    return { ...state, cards: newCards, activeCardIndex: newActiveCardIndex, activeCard: newActiveCard };
  }

  const removeCardWithId = (id) => {
    const index = getIndexWithId(id);
    if (index !== -1) {
      return removeCardAtIndex(index);
    } else {
      return state;
    }
  }

  /* General update functions */
  const setActiveCardIndex = (index) => {
    const { activeCard, activeCardIndex, cards } = state;

    if (index === activeCardIndex) {
      return state;
    }

    return {...state, activeCardIndex: index, activeCard: cards[index], cards: getUpdatedCards() };
  }

  switch (type) {
    case types.ADJUST_CARDS_DIMENSIONS: {
      const { newWidth, newHeight } = payload;
      return { ...state, cardsWidth: newWidth, cardsHeight: newHeight };
    }

    case types.OPEN_CARD: {
      const { card, isNewCard, createModalOpen } = payload;
      const { cards, activeCardIndex } = state;

      // TODO: Check if card is already open. If so, should switch to that tab.
      if (!isNewCard) {
        const currIndex = getIndexWithId(card._id);
        if (currIndex !== -1) {
          return setActiveCardIndex(currIndex);
        }
      }

      let cardInfo = { ...BASE_CARD_STATE, ...card };

      if (isNewCard) {
        cardInfo = createActiveCardEdits({
          ...cardInfo,
          _id: `new-card-${Math.floor(Math.random() * 10001)}`,
          cardStatus: CARD_STATUS_OPTIONS.NOT_DOCUMENTED,
          modalOpen: { ...cardInfo.modalOpen, [MODAL_TYPE.CREATE]: createModalOpen },
          editorEnabled: { ...cardInfo.editorEnabled, [EDITOR_TYPE.ANSWER]: true },
          messages: [],
          attachments: [],
          tags: [],
          keywords: [],
          verificationInterval: VERIFICATION_INTERVAL_OPTIONS[0],
          permissions: PERMISSION_OPTIONS[0],
          permissionGroups: [],
        });
      } else {
        // Will have to update this section in the future
        cardInfo = { ...cardInfo, hasLoaded: false };
      }

      let newCards = activeCardIndex === -1 ? [] : getUpdatedCards();
      newCards = [...newCards, cardInfo];

      return { ...state, cards: newCards, activeCard: cardInfo, activeCardIndex: newCards.length - 1 };
    }
    case types.SET_ACTIVE_CARD_INDEX: {
      const { index } = payload;
      return setActiveCardIndex(index);
    }
    case types.CLOSE_CARD: {
      const { index } = payload;
      return removeCardAtIndex(index);
    }

    case types.OPEN_CARD_SIDE_DOCK: {
      return updateActiveCard({ sideDockOpen: true });
    }
    case types.CLOSE_CARD_SIDE_DOCK: {
      return updateActiveCard({ sideDockOpen: false });
    }

    case types.OPEN_MODAL: {
      return { ...state, showCloseModal: true };
    }
    case types.CLOSE_MODAL: {
      return { ...state, showCloseModal: false };
    }

    case types.ENABLE_CARD_EDITOR: {
      const { editorType } = payload;
      const { activeCard } = state;
      return updateActiveCard({ editorEnabled: { ...activeCard.editorEnabled, [editorType]: true } });
    }
    case types.DISABLE_CARD_EDITOR: {
      const { editorType } = payload;
      const { activeCard } = state;
      return updateActiveCard({ editorEnabled: { ...activeCard.editorEnabled, [editorType]: false } });
    }

    case types.OPEN_CARD_MODAL: {
      const { modalType } = payload;
      const { activeCard } = state; 
      return updateActiveCard({ modalOpen: { ...activeCard.modalOpen, [modalType]: true } });
    }
    case types.CLOSE_CARD_MODAL: {
      const { modalType} = payload;
      const { activeCard } = state;
      const newInfo = { modalOpen: { ...activeCard.modalOpen, [modalType]: false } };
      return updateActiveCard(newInfo);
    }      
    case types.UPDATE_CARD_STATUS: {
      const { cardStatus } = payload;
      return updateActiveCard({ cardStatus });
    }

    case types.ADJUST_CARD_DESCRIPTION_SECTION_HEIGHT: {
      const { newHeight } = payload;
      return updateActiveCard({ descriptionSectionHeight: newHeight });
    }

    case types.UPDATE_CARD_QUESTION: {
      const { question } = payload;
      return updateActiveCardEdits({ question });
    }
    case types.UPDATE_CARD_ANSWER_EDITOR: {
      const { editorState } = payload;
      return updateActiveCardEdits({ answerEditorState: editorState });
    }
    case types.UPDATE_CARD_DESCRIPTION_EDITOR: {
      const { editorState } = payload;
      return updateActiveCardEdits({ descriptionEditorState: editorState });
    }

    case types.TOGGLE_CARD_SELECTED_MESSAGE: {
      const { messageIndex } = payload;
      const { activeCard } = state;
      
      const messages = activeCard.edits.messages;
      const newMessages = updateIndex(messages, messageIndex, { ...messages[messageIndex], selected: !messages[messageIndex].selected });
      return updateActiveCardEdits({ messages: newMessages });
    }
    case types.CANCEL_EDIT_CARD_MESSAGES: {
      const { activeCard } = state;
      return updateActiveCardEdits({ messages: activeCard.messages });
    }

    case types.ADD_CARD_ATTACHMENTS: {
      const { attachments } = payload;
      const { activeCard: { edits } } = state; 
      const newAttachments = attachments.map(attachment => ({ type: 'attachment', data: attachment }));
      return updateActiveCardEdits({ attachments: [...edits.attachments, ...newAttachments] });
    }
    case types.REMOVE_CARD_ATTACHMENT: {
      const { index } = payload;
      const { activeCard: { edits } } = state; 
      return updateActiveCardEdits({ attachments: removeIndex(edits.attachments, index) });
    }

    case types.ADD_CARD_OWNER: {
      const { owner } = payload;
      const { activeCard: { edits } } = state; 
      return updateActiveCardEdits({ owners: _.union(edits.owners, [owner]) });
    }
    case types.REMOVE_CARD_OWNER: {
      const { index } = payload;
      const { activeCard: { edits } } = state; 
      return updateActiveCardEdits({ owners: removeIndex(edits.owners, index) });
    }

    case types.UPDATE_CARD_TAGS: {
      const { tags } = payload;
      const { activeCard: { edits } } = state; 
      return updateActiveCardEdits({ tags: tags || [] });
    }
    case types.REMOVE_CARD_TAG: {
      const { index } = payload;
      const { activeCard: { edits } } = state; 
      return updateActiveCardEdits({ tags: removeIndex(edits.tags, index) });
    }

    case types.UPDATE_CARD_KEYWORDS: {
      const { keywords } = payload;
      return updateActiveCardEdits({ keywords: keywords || [] });
    }
    case types.UPDATE_CARD_VERIFICATION_INTERVAL: {
      const { verificationInterval } = payload;
      return updateActiveCardEdits({ verificationInterval });
    }
    case types.UPDATE_CARD_PERMISSIONS: {
      const { permissions } = payload;
      return updateActiveCardEdits({ permissions });
    }
    case types.UPDATE_CARD_PERMISSION_GROUPS: {
      const { permissionGroups } = payload;
      return updateActiveCardEdits({ permissionGroups: permissionGroups || [] });
    }

    case types.EDIT_CARD: {
      const { activeCard } = state;
      return { ...state, activeCard: createActiveCardEdits(activeCard) };
    }
    case types.CANCEL_EDIT_CARD: { 
      const { activeCard } = state;
      return updateActiveCard({ isEditing: false, edits: {} });
    }

    /* API REQUESTS */
    case types.GET_CARD_REQUEST: {
      return updateActiveCard({ isGettingCard: true, getError: null });
    }
    case types.GET_CARD_SUCCESS: {
      const { id, card } = payload;
      const newInfo = { isGettingCard: false, hasLoaded: true, ...convertCardToFrontendFormat(card), ...BASE_CARD_STATE };
      return updateCardWithId(id, newInfo, true);
    }
    case types.GET_CARD_ERROR: {
      const { id, error } = payload;
      return updateCardWithId(id, { isGettingCard: false, getError: error });
    }

    case types.CREATE_CARD_REQUEST: {
      return updateActiveCard({ isCreatingCard: true, createError: null });
    }
    case types.CREATE_CARD_SUCCESS: {
      const { id, card } = payload;
      const newInfo = { isCreatingCard: false, ...convertCardToFrontendFormat(card), ...BASE_CARD_STATE };
      return updateCardWithId(id, newInfo, true);
    }
    case types.CREATE_CARD_ERROR: {
      const { id, error } = payload;
      return updateCardWithId(id, { isCreatingCard: false, createError: error });
    }

    case types.UPDATE_CARD_REQUEST: {
      return updateActiveCard({ isUpdatingCard: true, updateError: null });
    }
    case types.UPDATE_CARD_SUCCESS: {
      const { closeCard, card } = payload;
      const { activeCard, cards } = state;

      const cardStatus = card.status;
      const isOutdated = cardStatus === CARD_STATUS_OPTIONS.OUT_OF_DATE || cardStatus === CARD_STATUS_OPTIONS.NEEDS_VERIFICATION;

      // Remove card
      if (closeCard && !isOutdated) {
        return removeCardWithId(id);
      }

      const newInfo = { isUpdatingCard: false, ...convertCardToFrontendFormat(card), ...BASE_CARD_STATE };
      
      const currCard = getCardWithId(card._id); 
      if (!currCard) {
        return state;
      }

      // Open corresponding modals
      if (isOutdated) {
        newInfo.modalOpen = { ...currCard.modalOpen, [MODAL_TYPE.CONFIRM_UP_TO_DATE_SAVE]: true }
      } else if (closeCard) {
        newInfo.modalOpen = { ...currCard.modalOpen, [MODAL_TYPE.CONFIRM_CLOSE]: false }
      }

      return updateCardWithId(card._id, newInfo, true);
    }
    case types.UPDATE_CARD_ERROR: {
      const { id, error, closeCard } = payload;

      const currCard = getCardWithId(id); 
      if (!currCard) {
        return state;
      }

      const newInfo = {
        isUpdatingCard: false,
        updateError: error,
        modalOpen: { ...BASE_MODAL_OPEN_STATE, [closeCard ? MODAL_TYPE.ERROR_UPDATE_CLOSE : MODAL_TYPE.ERROR_UPDATE]: true }
      }

      return updateCardWithId(id, newInfo);
    }

    case types.CLOSE_ALL_CARDS: {
      return initialState;
    }

    default:
      return state;
  }
}

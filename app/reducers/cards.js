import _ from 'lodash';
import { EditorState } from 'draft-js';
import * as types from 'actions/actionTypes';
import { removeIndex, updateIndex, updateArrayOfObjects } from 'utils/array';
import { convertCardToFrontendFormat, generateCardId } from 'utils/card';
import { CARD, FINDER } from 'appConstants';

const initialState = {
  showCards: false,
  cards: [],
  cardsWidth: CARD.DIMENSIONS.DEFAULT_CARDS_WIDTH,
  cardsHeight: CARD.DIMENSIONS.DEFAULT_CARDS_HEIGHT,
  activeCardIndex: FINDER.TAB_INDEX,
  activeCard: FINDER.TAB,
  cardsExpanded: true,
  windowPosition: {
    x: window.innerWidth / 2 - CARD.DIMENSIONS.DEFAULT_CARDS_WIDTH / 2,
    y: window.innerHeight / 2 - CARD.DIMENSIONS.DEFAULT_CARDS_HEIGHT / 2
  },
  showCloseModal: false
};

const BASE_MODAL_OPEN_STATE = _.mapValues(CARD.MODAL_TYPE, () => false);
const BASE_EDITOR_ENABLED_STATE = _.mapValues(CARD.EDITOR_TYPE, () => false);

const BASE_CARD_STATE = {
  isEditing: false,
  sideDockOpen: false,
  modalOpen: BASE_MODAL_OPEN_STATE,
  editorEnabled: BASE_EDITOR_ENABLED_STATE,
  descriptionSectionHeight: CARD.DIMENSIONS.MIN_QUESTION_HEIGHT,
  edits: {},
  hasLoaded: true,
  outOfDateReasonInput: '',
  status: CARD.STATUS.NOT_DOCUMENTED,
  tags: [],
  verificationInterval: CARD.DEFAULT_VERIFICATION_INTERVAL,
  permissions: CARD.PERMISSION_OPTIONS[0],
  permissionGroups: [],
  upvotes: [],
  slackThreadIndex: 0,
  slackThreadConvoPairs: [],
  slackReplies: [],
  attachments: [],
  owners: [],
  subscribers: [],
  question: '',
  answerEditorState: EditorState.createEmpty(),
  descriptionEditorState: EditorState.createEmpty(),
  path: []
};

export default function cardsReducer(state = initialState, action) {
  const { type, payload = {} } = action;

  /* General helpers */
  const getIndexById = (id) => state.cards.findIndex((card) => card._id === id);

  const getCardById = (id) => {
    const { activeCard, cards } = state;
    if (id === activeCard._id) {
      return activeCard;
    }

    const index = getIndexById(id);
    if (index === -1) {
      return null;
    }
    return cards[index];
  };

  /* Edit Card helper functions */
  const updateActiveCard = (newInfo, newEditsInfo = {}) => ({
    ...state,
    activeCard: {
      ...state.activeCard,
      edits: { ...state.activeCard.edits, ...newEditsInfo },
      ...newInfo
    }
  });

  const updateActiveCardEdits = (newEditsInfo) => updateActiveCard({}, newEditsInfo);

  const updateCardById = (id, newInfo, updateCardsArray = false) => {
    if (id === state.activeCard._id && !updateCardsArray) {
      return updateActiveCard(newInfo);
    }
    if (id === state.activeCard._id && updateCardsArray) {
      const newActiveCard = { ...state.activeCard, ...newInfo };
      return {
        ...state,
        activeCard: newActiveCard,
        cards: updateArrayOfObjects(state.cards, { _id: id }, newActiveCard, false)
      };
    }
    return {
      ...state,
      cards: updateArrayOfObjects(state.cards, { _id: id }, newInfo)
    };
  };

  const createCardEdits = (card) => {
    const {
      owners,
      subscribers,
      attachments,
      tags,
      permissions,
      permissionGroups,
      verificationInterval,
      question,
      answerEditorState,
      descriptionEditorState,
      path,
      slackReplies,
      edits
    } = card;
    return {
      ...card,
      isEditing: true,
      edits: {
        owners,
        subscribers,
        attachments,
        tags,
        permissions,
        permissionGroups,
        verificationInterval,
        question,
        answerEditorState,
        descriptionEditorState,
        path,
        slackReplies,
        ...edits
      }
    };
  };

  const getUpdatedCards = () => {
    const { activeCardIndex, cards, activeCard } = state;
    return updateIndex(cards, activeCardIndex, activeCard);
  };

  const updateAttachmentsByKey = (cardId, key, newInfo) => {
    const currCard = getCardById(cardId);
    if (!currCard) {
      return state;
    }

    const newCardInfo = {
      edits: {
        ...currCard.edits,
        attachments: updateArrayOfObjects(currCard.edits.attachments, { key }, newInfo)
      }
    };

    return updateCardById(cardId, newCardInfo);
  };

  /* Card removal functions */
  const removeCardAtIndex = (index) => {
    const { activeCardIndex, cards, activeCard } = state;

    const newCards = removeIndex(cards, index);

    if (newCards.length === 0) {
      // Return to finder view
      return {
        ...state,
        cards: newCards,
        activeCardIndex: FINDER.TAB_INDEX,
        activeCard: FINDER.TAB
      };
    }

    const isClosingActiveCard = index === activeCardIndex;

    let newActiveCardIndex = activeCardIndex;
    if (newActiveCardIndex >= newCards.length) {
      newActiveCardIndex = newCards.length - 1;
    }

    const newActiveCard = isClosingActiveCard ? newCards[newActiveCardIndex] : activeCard;

    return {
      ...state,
      cards: newCards,
      activeCardIndex: newActiveCardIndex,
      activeCard: newActiveCard
    };
  };

  const removeCardById = (id) => {
    const index = getIndexById(id);
    if (index !== -1) {
      return removeCardAtIndex(index);
    }
    return state;
  };

  /* General update functions */
  const setActiveCardIndex = (index) => {
    const { activeCardIndex, cards } = state;

    if (index === activeCardIndex) {
      return state;
    }

    const activeCard = index === FINDER.TAB_INDEX ? FINDER.TAB : cards[index];
    return { ...state, activeCardIndex: index, activeCard, cards: getUpdatedCards() };
  };

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
      const { cards } = state;

      const newCards = Array.from(cards);
      const [removed] = newCards.splice(source.index, 1);
      newCards.splice(destination.index, 0, removed);

      return { ...state, cards: newCards, activeCardIndex: destination.index };
    }
    case types.TOGGLE_CARDS: {
      return { ...state, cardsExpanded: !state.cardsExpanded };
    }

    case types.OPEN_FINDER: {
      const newState = state.showCards ? setActiveCardIndex(FINDER.TAB_INDEX) : state;
      return { ...newState, showCards: true, cardsExpanded: true };
    }
    case types.OPEN_CARD: {
      const { card, isNewCard, createModalOpen } = payload;

      if (!isNewCard) {
        const currIndex = getIndexById(card._id);
        if (currIndex !== -1) {
          return { ...setActiveCardIndex(currIndex), cardsExpanded: true };
        }
      }

      let cardInfo = { ...BASE_CARD_STATE, ...card };

      if (isNewCard) {
        cardInfo = createCardEdits({
          ...cardInfo,
          _id: generateCardId(),
          modalOpen: { ...cardInfo.modalOpen, [CARD.MODAL_TYPE.CREATE]: createModalOpen },
          editorEnabled: { ...cardInfo.editorEnabled, [CARD.EDITOR_TYPE.ANSWER]: true }
        });
      } else {
        // Will have to update this section in the future
        cardInfo = { ...cardInfo, hasLoaded: false };
      }

      const newCards = [...getUpdatedCards(), cardInfo];
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
      return setActiveCardIndex(index);
    }
    case types.CLOSE_CARD: {
      const { index } = payload;
      return removeCardAtIndex(index);
    }

    case types.OPEN_CARD_CONTAINER_MODAL: {
      return { ...state, showCloseModal: true, cardsExpanded: true };
    }
    case types.CLOSE_CARD_CONTAINER_MODAL: {
      return { ...state, showCloseModal: false };
    }

    case types.OPEN_CARD_SIDE_DOCK: {
      return updateActiveCard({ sideDockOpen: true });
    }
    case types.CLOSE_CARD_SIDE_DOCK: {
      return updateActiveCard({ sideDockOpen: false });
    }

    case types.ENABLE_CARD_EDITOR: {
      const { editorType } = payload;
      return updateActiveCard({
        editorEnabled: { ...BASE_EDITOR_ENABLED_STATE, [editorType]: true }
      });
    }

    case types.OPEN_CARD_MODAL: {
      const { modalType } = payload;
      const { activeCard } = state;
      return updateActiveCard({
        modalOpen: { ...activeCard.modalOpen, [modalType]: true }
      });
    }
    case types.CLOSE_CARD_MODAL: {
      const { modalType } = payload;
      const { activeCard } = state;
      const newInfo = {
        modalOpen: { ...activeCard.modalOpen, [modalType]: false },
        outOfDateReasonInput: ''
      };
      return updateActiveCard(newInfo);
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

    case types.UPDATE_CARD_SELECTED_THREAD: {
      const { index } = payload;
      return updateActiveCard({ slackThreadIndex: index });
    }
    case types.TOGGLE_CARD_SELECTED_MESSAGE: {
      const { messageIndex } = payload;
      const { activeCard } = state;

      const { slackReplies } = activeCard.edits;
      const newSlackReplies = updateIndex(
        slackReplies,
        messageIndex,
        {
          selected: !slackReplies[messageIndex].selected
        },
        true
      );
      return updateActiveCardEdits({ slackReplies: newSlackReplies });
    }
    case types.CANCEL_EDIT_CARD_MESSAGES: {
      const { activeCard } = state;
      return updateActiveCardEdits({ slackReplies: activeCard.slackReplies });
    }

    case types.ADD_CARD_OWNER: {
      const { owner } = payload;
      const {
        activeCard: { edits }
      } = state;
      return updateActiveCardEdits({
        owners: _.unionBy(edits.owners, [owner], '_id'),
        subscribers: _.unionBy(edits.subscribers, [owner], '_id')
      });
    }
    case types.REMOVE_CARD_OWNER: {
      const { index } = payload;
      const {
        activeCard: { edits }
      } = state;
      return updateActiveCardEdits({ owners: removeIndex(edits.owners, index) });
    }

    case types.ADD_CARD_SUBSCRIBER: {
      const { subscriber } = payload;
      const {
        activeCard: { edits }
      } = state;
      return updateActiveCardEdits({
        subscribers: _.unionBy(edits.subscribers, [subscriber], '_id')
      });
    }
    case types.REMOVE_CARD_SUBSCRIBER: {
      const { index } = payload;
      const {
        activeCard: { edits }
      } = state;
      return updateActiveCardEdits({ subscribers: removeIndex(edits.subscribers, index) });
    }

    case types.UPDATE_CARD_TAGS: {
      const { tags } = payload;
      return updateActiveCardEdits({ tags: tags || [] });
    }
    case types.REMOVE_CARD_TAG: {
      const { index } = payload;
      const {
        activeCard: { edits }
      } = state;
      return updateActiveCardEdits({ tags: removeIndex(edits.tags, index) });
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
      return { ...state, activeCard: createCardEdits(activeCard) };
    }
    case types.CANCEL_EDIT_CARD: {
      return updateActiveCard({ isEditing: false, edits: {} });
    }

    case types.UPDATE_OUT_OF_DATE_REASON: {
      const { reason } = payload;
      return updateActiveCard({ outOfDateReasonInput: reason });
    }

    case types.UPDATE_CARD: {
      const { card } = payload;
      return updateCardById(card._id, card);
    }

    /* API REQUESTS */
    case types.ADD_CARD_ATTACHMENT_REQUEST: {
      const { cardId, key, file } = payload;

      const currCard = getCardById(cardId);
      if (!currCard) {
        return state;
      }

      return updateCardById(cardId, {
        edits: {
          ...currCard.edits,
          attachments: [
            ...currCard.edits.attachments,
            { key, name: file.name, mimetype: file.type, isLoading: true, error: null }
          ]
        }
      });
    }
    case types.ADD_CARD_ATTACHMENT_SUCCESS: {
      const { cardId, key, attachment } = payload;
      return updateAttachmentsByKey(cardId, key, { isLoading: false, ...attachment });
    }
    case types.ADD_CARD_ATTACHMENT_ERROR: {
      const { cardId, key, error } = payload;
      return updateAttachmentsByKey(cardId, key, { isLoading: false, error });
    }

    case types.REMOVE_CARD_ATTACHMENT: {
      const { key } = payload;
      const {
        activeCard: { edits }
      } = state;
      return updateActiveCardEdits({
        attachments: edits.attachments.filter((attachment) => attachment.key !== key)
      });
    }
    case types.UPDATE_CARD_ATTACHMENT_NAME: {
      const { key, name } = payload;
      const {
        activeCard: { _id }
      } = state;
      return updateAttachmentsByKey(_id, key, { name });
    }

    case types.GET_CARD_REQUEST: {
      return updateActiveCard({ isGettingCard: true, getError: null });
    }
    case types.GET_CARD_SUCCESS: {
      const { cardId, card } = payload;

      const currCard = getCardById(cardId);
      const isEditing =
        (currCard && currCard.isEditing) || card.status === CARD.STATUS.NOT_DOCUMENTED;

      let newCardInfo = convertCardToFrontendFormat(card);
      if (isEditing) {
        newCardInfo = createCardEdits(newCardInfo);
      }

      const newInfo = { ...BASE_CARD_STATE, isGettingCard: false, hasLoaded: true, ...newCardInfo };
      return updateCardById(cardId, newInfo, true);
    }
    case types.GET_CARD_ERROR: {
      const { cardId, error } = payload;
      return updateCardById(cardId, { isGettingCard: false, getError: error });
    }

    case types.CREATE_CARD_REQUEST: {
      return updateActiveCard({ isCreatingCard: true, createError: null });
    }
    case types.CREATE_CARD_SUCCESS: {
      const { cardId, card } = payload;
      const newInfo = {
        ...BASE_CARD_STATE,
        isCreatingCard: false,
        ...convertCardToFrontendFormat(card)
      };
      return updateCardById(cardId, newInfo, true);
    }
    case types.CREATE_CARD_ERROR: {
      const { cardId, error } = payload;
      return updateCardById(cardId, { isCreatingCard: false, createError: error });
    }

    case types.UPDATE_CARD_REQUEST: {
      return updateActiveCard({ isUpdatingCard: true, updateError: null });
    }
    case types.UPDATE_CARD_SUCCESS: {
      const { shouldCloseCard, card, isApprover } = payload;

      const cardStatus = card.status;
      const isOutdated = cardStatus !== CARD.STATUS.UP_TO_DATE;

      // Remove card
      if (shouldCloseCard && !isOutdated) {
        return removeCardById(card._id);
      }

      const newInfo = {
        ...BASE_CARD_STATE,
        isUpdatingCard: false,
        ...convertCardToFrontendFormat(card)
      };

      const currCard = getCardById(card._id);
      if (!currCard) {
        return state;
      }

      // Open corresponding modals
      if (isOutdated && isApprover) {
        newInfo.modalOpen = {
          ...currCard.modalOpen,
          [CARD.MODAL_TYPE.CONFIRM_UP_TO_DATE_SAVE]: true
        };
      } else if (shouldCloseCard) {
        newInfo.modalOpen = { ...currCard.modalOpen, [CARD.MODAL_TYPE.CONFIRM_CLOSE]: false };
      }

      return updateCardById(card._id, newInfo, true);
    }
    case types.UPDATE_CARD_ERROR: {
      const { cardId, error, shouldCloseCard } = payload;
      const modalType = shouldCloseCard
        ? CARD.MODAL_TYPE.ERROR_UPDATE_CLOSE
        : CARD.MODAL_TYPE.ERROR_UPDATE;
      const newInfo = {
        isUpdatingCard: false,
        updateError: error,
        modalOpen: {
          ...BASE_MODAL_OPEN_STATE,
          [modalType]: true
        }
      };
      return updateCardById(cardId, newInfo);
    }

    case types.TOGGLE_UPVOTE_REQUEST: {
      const { upvotes } = payload;
      return updateActiveCard({ isTogglingUpvote: true, toggleUpvoteError: null, upvotes });
    }
    case types.TOGGLE_UPVOTE_SUCCESS: {
      const { card } = payload;
      const newInfo = { isTogglingUpvote: false, ...convertCardToFrontendFormat(card) };
      return updateCardById(card._id, newInfo, true);
    }
    case types.TOGGLE_UPVOTE_ERROR: {
      const { cardId, error, oldUpvotes } = payload;
      return updateCardById(cardId, {
        isTogglingUpvote: false,
        toggleUpvoteError: error,
        upvotes: oldUpvotes
      });
    }

    case types.DELETE_CARD_REQUEST: {
      return updateActiveCard({ isDeletingCard: true, deleteError: null });
    }
    case types.DELETE_CARD_SUCCESS: {
      const { cardId } = payload;
      return removeCardById(cardId);
    }
    case types.DELETE_CARD_ERROR: {
      const { cardId, error } = payload;
      const newInfo = {
        isDeletingCard: false,
        deleteError: error,
        modalOpen: { ...BASE_MODAL_OPEN_STATE, [CARD.MODAL_TYPE.ERROR_DELETE]: true }
      };
      return updateCardById(cardId, newInfo);
    }

    case types.MARK_UP_TO_DATE_REQUEST:
    case types.MARK_OUT_OF_DATE_REQUEST:
    case types.APPROVE_CARD_REQUEST: {
      return updateActiveCard({ isMarkingStatus: true, markStatusError: null });
    }
    case types.MARK_UP_TO_DATE_SUCCESS:
    case types.MARK_OUT_OF_DATE_SUCCESS:
    case types.APPROVE_CARD_SUCCESS: {
      const { card } = payload;
      const newInfo = {
        isMarkingStatus: false,
        ...convertCardToFrontendFormat(card),
        outOfDateReasonInput: '',
        modalOpen: BASE_MODAL_OPEN_STATE
      };
      return updateCardById(card._id, newInfo, true);
    }
    case types.MARK_UP_TO_DATE_ERROR:
    case types.MARK_OUT_OF_DATE_ERROR:
    case types.APPROVE_CARD_ERROR: {
      const { cardId, error } = payload;
      return updateCardById(cardId, { isMarkingStatus: false, markStatusError: error });
    }

    case types.ADD_BOOKMARK_REQUEST:
    case types.REMOVE_BOOKMARK_REQUEST: {
      return updateActiveCard({ isUpdatingBookmark: true, bookmarkError: null });
    }
    case types.ADD_BOOKMARK_SUCCESS:
    case types.REMOVE_BOOKMARK_SUCCESS: {
      const { cardId } = payload;
      return updateCardById(cardId, { isUpdatingBookmark: false });
    }
    case types.ADD_BOOKMARK_ERROR:
    case types.REMOVE_BOOKMARK_ERROR: {
      const { cardId, error } = payload;
      return updateCardById(cardId, { isUpdatingBookmark: false, bookmarkError: error });
    }

    case types.GET_SLACK_THREAD_REQUEST: {
      return updateActiveCard({ isGettingSlackThread: true, getSlackThreadError: null });
    }
    case types.GET_SLACK_THREAD_SUCCESS: {
      const { cardId, slackReplies } = payload;
      const { edits } = getCardById(cardId);
      return updateCardById(cardId, {
        isGettingSlackThread: false,
        modalOpen: BASE_MODAL_OPEN_STATE,
        slackReplies,
        edits: { ...edits, slackReplies }
      });
    }
    case types.GET_SLACK_THREAD_ERROR: {
      const { cardId, error } = payload;
      return updateCardById(cardId, { isGettingSlackThread: false, getSlackThreadError: error });
    }

    case types.CLOSE_ALL_CARDS: {
      return initialState;
    }

    default:
      return state;
  }
}

import _ from 'lodash';
import * as types from 'actions/actionTypes';
import { removeIndex, updateIndex } from 'utils/array';
import { convertCardToFrontendFormat, generateCardId } from 'utils/card';
import {
  BASE_MODAL_OPEN_STATE,
  BASE_CARD_STATE,
  createCardEdits,
  getIndexById,
  getCardById,
  updateActiveCard,
  updateActiveCardEdits,
  updateCardById,
  getUpdatedCards,
  removeCardAtIndex,
  removeCardById,
  setActiveCardIndex,
  updateAttachmentsByKey
} from 'utils/reducers/cards';
import { CARD, FINDER, USER } from 'appConstants';

const initialState = {
  showCards: false,
  cards: [],
  cardsWidth: CARD.DIMENSIONS.DEFAULT_CARDS_WIDTH,
  cardsHeight: CARD.DIMENSIONS.DEFAULT_CARDS_HEIGHT,
  activeCardIndex: FINDER.TAB_INDEX,
  activeCard: FINDER.TAB,
  cardsExpanded: true,
  cardsMaximized: false,
  windowPosition: {
    x: window.innerWidth / 2 - CARD.DIMENSIONS.DEFAULT_CARDS_WIDTH / 2,
    y: window.innerHeight / 2 - CARD.DIMENSIONS.DEFAULT_CARDS_HEIGHT / 2
  },
  showCloseModal: false
};

export default function cardsReducer(state = initialState, action) {
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
      const { cards } = state;

      const newCards = Array.from(cards);
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
        // Will have to update this section in the future
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

    case types.OPEN_CARD_SIDE_DOCK: {
      return updateActiveCard(state, { sideDockOpen: true });
    }
    case types.CLOSE_CARD_SIDE_DOCK: {
      return updateActiveCard(state, { sideDockOpen: false });
    }

    case types.OPEN_CARD_MODAL: {
      const { modalType } = payload;
      const { activeCard } = state;
      return updateActiveCard(state, {
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
      return updateActiveCard(state, newInfo);
    }

    case types.UPDATE_CARD_QUESTION: {
      const { question } = payload;
      return updateActiveCardEdits(state, { question });
    }
    case types.UPDATE_CARD_ANSWER: {
      const { answer } = payload;
      return updateActiveCardEdits(state, { answerModel: answer });
    }

    case types.UPDATE_CARD_SELECTED_THREAD: {
      const { index } = payload;
      return updateActiveCard(state, { slackThreadIndex: index });
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
      return updateActiveCardEdits(state, { slackReplies: newSlackReplies });
    }
    case types.CANCEL_EDIT_CARD_MESSAGES: {
      const { activeCard } = state;
      return updateActiveCardEdits(state, { slackReplies: activeCard.slackReplies });
    }

    case types.UPDATE_CARD_FINDER_NODE: {
      const { finderNode } = payload;
      return updateActiveCardEdits(state, { finderNode });
    }

    case types.ADD_CARD_OWNER: {
      const { owner } = payload;
      const {
        activeCard: { edits }
      } = state;
      return updateActiveCardEdits(state, {
        owners: _.unionBy(edits.owners, [owner], '_id'),
        subscribers: _.unionBy(edits.subscribers, [owner], '_id')
      });
    }
    case types.REMOVE_CARD_OWNER: {
      const { index } = payload;
      const {
        activeCard: { edits }
      } = state;
      return updateActiveCardEdits(state, { owners: removeIndex(edits.owners, index) });
    }

    case types.ADD_CARD_SUBSCRIBER: {
      const { subscriber } = payload;
      const {
        activeCard: { edits }
      } = state;
      return updateActiveCardEdits(state, {
        subscribers: _.unionBy(edits.subscribers, [subscriber], '_id')
      });
    }
    case types.REMOVE_CARD_SUBSCRIBER: {
      const { index } = payload;
      const {
        activeCard: { edits }
      } = state;
      return updateActiveCardEdits(state, { subscribers: removeIndex(edits.subscribers, index) });
    }

    case types.ADD_CARD_APPROVER: {
      const { approver } = payload;
      const { activeCard } = state;
      return updateActiveCardEdits(state, {
        approvers: _.unionBy(activeCard.edits.approvers, [approver], '_id')
      });
    }
    case types.REMOVE_CARD_APPROVER: {
      const { index } = payload;
      const {
        activeCard: { edits }
      } = state;
      return updateActiveCardEdits(state, { approvers: removeIndex(edits.approvers, index) });
    }

    case types.UPDATE_CARD_TAGS: {
      const { tags } = payload;
      return updateActiveCardEdits(state, { tags: tags || [] });
    }
    case types.REMOVE_CARD_TAG: {
      const { index } = payload;
      const {
        activeCard: { edits }
      } = state;
      return updateActiveCardEdits(state, { tags: removeIndex(edits.tags, index) });
    }

    case types.UPDATE_CARD_VERIFICATION_INTERVAL: {
      const { verificationInterval } = payload;
      return updateActiveCardEdits(state, { verificationInterval });
    }
    case types.UPDATE_CARD_PERMISSIONS: {
      const { permissions } = payload;
      return updateActiveCardEdits(state, { permissions });
    }
    case types.UPDATE_CARD_PERMISSION_GROUPS: {
      const { permissionGroups } = payload;
      return updateActiveCardEdits(state, { permissionGroups: permissionGroups || [] });
    }

    case types.UPDATE_INVITE_EMAIL: {
      const { email } = payload;
      return updateActiveCard(state, { inviteEmail: email });
    }
    case types.UPDATE_INVITE_ROLE: {
      const { role } = payload;
      return updateActiveCard(state, { inviteRole: role });
    }
    case types.UPDATE_INVITE_TYPE: {
      const { inviteType } = payload;
      return updateActiveCard(state, { inviteType });
    }

    case types.EDIT_CARD: {
      const { activeCard } = state;
      return { ...state, activeCard: createCardEdits(activeCard) };
    }
    case types.CANCEL_EDIT_CARD: {
      return updateActiveCard(state, { isEditing: false, edits: {} });
    }

    case types.UPDATE_OUT_OF_DATE_REASON: {
      const { reason } = payload;
      return updateActiveCard(state, { outOfDateReasonInput: reason });
    }
    case types.UPDATE_EDIT_ACCESS_REASON: {
      const { reason } = payload;
      return updateActiveCard(state, { editAccessReasonInput: reason });
    }

    case types.UPDATE_CARD: {
      const { card } = payload;
      return updateCardById(state, card._id, convertCardToFrontendFormat(card));
    }

    /* API REQUESTS */
    case types.ADD_CARD_ATTACHMENT_REQUEST: {
      const { cardId, key, file } = payload;

      const currCard = getCardById(state, cardId);
      if (!currCard) {
        return state;
      }

      return updateCardById(state, cardId, {
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
      return updateAttachmentsByKey(state, cardId, key, { isLoading: false, ...attachment });
    }
    case types.ADD_CARD_ATTACHMENT_ERROR: {
      const { cardId, key, error } = payload;
      return updateAttachmentsByKey(state, cardId, key, { isLoading: false, error });
    }

    case types.REMOVE_CARD_ATTACHMENT: {
      const { key } = payload;
      const {
        activeCard: { edits }
      } = state;
      return updateActiveCardEdits(state, {
        attachments: edits.attachments.filter((attachment) => attachment.key !== key)
      });
    }
    case types.UPDATE_CARD_ATTACHMENT_NAME: {
      const { key, name } = payload;
      const {
        activeCard: { _id }
      } = state;
      return updateAttachmentsByKey(state, _id, key, { name });
    }

    case types.GET_CARD_REQUEST: {
      return updateActiveCard(state, { isGettingCard: true, getError: null });
    }
    case types.GET_CARD_SUCCESS: {
      const { cardId, card } = payload;

      const currCard = getCardById(state, cardId);
      const isEditing =
        (currCard && currCard.isEditing) || card.status === CARD.STATUS.NOT_DOCUMENTED;

      let newCardInfo = convertCardToFrontendFormat(card);
      if (isEditing) {
        newCardInfo = createCardEdits(newCardInfo);
      }

      const newInfo = { ...BASE_CARD_STATE, isGettingCard: false, hasLoaded: true, ...newCardInfo };
      return updateCardById(state, cardId, newInfo, true);
    }
    case types.GET_CARD_ERROR: {
      const { cardId, error } = payload;
      return updateCardById(state, cardId, { isGettingCard: false, getError: error });
    }

    case types.CREATE_CARD_REQUEST: {
      return updateActiveCard(state, { isCreatingCard: true, createError: null });
    }
    case types.CREATE_CARD_SUCCESS: {
      const { cardId, card } = payload;
      const newInfo = {
        ...BASE_CARD_STATE,
        isCreatingCard: false,
        ...convertCardToFrontendFormat(card)
      };
      return updateCardById(state, cardId, newInfo, true);
    }
    case types.CREATE_CARD_ERROR: {
      const { cardId, error } = payload;
      return updateCardById(state, cardId, { isCreatingCard: false, createError: error });
    }

    case types.UPDATE_CARD_REQUEST: {
      return updateActiveCard(state, { isUpdatingCard: true, updateError: null });
    }
    case types.UPDATE_CARD_SUCCESS: {
      const { shouldCloseCard, card, isApprover } = payload;
      const isOutdated = card.status !== CARD.STATUS.UP_TO_DATE;

      const currCard = getCardById(state, card._id);
      if (!currCard) {
        return state;
      }

      // Remove card
      if (shouldCloseCard && !isOutdated) {
        return removeCardById(state, card._id);
      }

      const newInfo = {
        ...BASE_CARD_STATE,
        isUpdatingCard: false,
        ...convertCardToFrontendFormat(card)
      };

      // Open corresponding modals
      const wasUndocumented = currCard.status === CARD.STATUS.NOT_DOCUMENTED;
      if (isOutdated && !wasUndocumented && isApprover) {
        newInfo.modalOpen = { ...BASE_CARD_STATE, [CARD.MODAL_TYPE.CONFIRM_UP_TO_DATE_SAVE]: true };
      } else if (shouldCloseCard) {
        newInfo.modalOpen = { ...BASE_CARD_STATE, [CARD.MODAL_TYPE.CONFIRM_CLOSE]: false };
      }

      return updateCardById(state, card._id, newInfo, true);
    }
    case types.UPDATE_CARD_ERROR: {
      const { cardId, error, shouldCloseCard } = payload;
      const newInfo = { isUpdatingCard: false, updateError: error };

      const currCard = getCardById(state, cardId);
      if (currCard.status !== CARD.STATUS.NOT_DOCUMENTED) {
        const modalType = shouldCloseCard
          ? CARD.MODAL_TYPE.ERROR_UPDATE_CLOSE
          : CARD.MODAL_TYPE.ERROR_UPDATE;

        newInfo.modalOpen = {
          ...BASE_MODAL_OPEN_STATE,
          [modalType]: true
        };
      }

      return updateCardById(state, cardId, newInfo);
    }

    case types.GET_EDIT_ACCESS_REQUEST: {
      return updateActiveCard(state, { isRequestingEditAccess: true, editAccessError: null });
    }
    case types.GET_EDIT_ACCESS_SUCCESS: {
      const { cardId } = payload;
      const newInfo = {
        modalOpen: {
          ...BASE_MODAL_OPEN_STATE,
          [CARD.MODAL_TYPE.EDIT_ACCESS_REQUEST]: false
        },
        editAccessReasonInput: '',
        requestedEditAccess: true,
        isRequestingEditAccess: false
      };
      return updateCardById(state, cardId, newInfo, true);
    }
    case types.GET_EDIT_ACCESS_ERROR: {
      const { cardId, error } = payload;
      return updateCardById(state, cardId, {
        isRequestingEditAccess: false,
        editAccessError: error
      });
    }

    case types.TOGGLE_UPVOTE_REQUEST: {
      const { upvotes } = payload;
      return updateActiveCard(state, { isTogglingUpvote: true, toggleUpvoteError: null, upvotes });
    }
    case types.TOGGLE_UPVOTE_SUCCESS: {
      const { card } = payload;
      const newInfo = { isTogglingUpvote: false, ...convertCardToFrontendFormat(card) };
      return updateCardById(state, card._id, newInfo, true);
    }
    case types.TOGGLE_UPVOTE_ERROR: {
      const { cardId, error, oldUpvotes } = payload;
      return updateCardById(state, cardId, {
        isTogglingUpvote: false,
        toggleUpvoteError: error,
        upvotes: oldUpvotes
      });
    }

    case types.TOGGLE_SUBSCRIBE_REQUEST: {
      return updateActiveCard(state, { isTogglingSubscribe: true, toggleSubscribeError: null });
    }
    case types.TOGGLE_SUBSCRIBE_SUCCESS: {
      const { card } = payload;
      const newInfo = { isTogglingSubscribe: false, ...convertCardToFrontendFormat(card) };
      return updateCardById(state, card._id, newInfo, true);
    }
    case types.TOGGLE_SUBSCRIBE_ERROR: {
      const { cardId, error } = payload;
      return updateCardById(state, cardId, {
        isTogglingSubscribe: false,
        toggleSubscribeError: error
      });
    }

    case types.ARCHIVE_CARD_REQUEST: {
      return updateActiveCard(state, { isArchivingCard: true, archiveError: null });
    }
    case types.ARCHIVE_CARD_ERROR: {
      const { cardId, error } = payload;
      const newInfo = {
        isArchivingCard: false,
        archiveError: error,
        modalOpen: { ...BASE_MODAL_OPEN_STATE, [CARD.MODAL_TYPE.ERROR_ARCHIVE]: true }
      };
      return updateCardById(state, cardId, newInfo);
    }

    case types.DELETE_CARD_REQUEST: {
      return updateActiveCard(state, { isDeletingCard: true, deleteError: null });
    }
    case types.DELETE_CARD_ERROR: {
      const { cardId, error } = payload;
      const newInfo = {
        isDeletingCard: false,
        deleteError: error,
        modalOpen: { ...BASE_MODAL_OPEN_STATE, [CARD.MODAL_TYPE.ERROR_DELETE]: true }
      };
      return updateCardById(state, cardId, newInfo);
    }

    case types.ARCHIVE_CARD_SUCCESS:
    case types.DELETE_CARD_SUCCESS: {
      const { cardId } = payload;
      return removeCardById(state, cardId);
    }

    case types.MARK_UP_TO_DATE_REQUEST:
    case types.MARK_OUT_OF_DATE_REQUEST: {
      return updateActiveCard(state, { isMarkingStatus: true, markStatusError: null });
    }
    case types.MARK_UP_TO_DATE_SUCCESS:
    case types.MARK_OUT_OF_DATE_SUCCESS: {
      const { card } = payload;
      const newInfo = {
        isMarkingStatus: false,
        ...convertCardToFrontendFormat(card),
        outOfDateReasonInput: '',
        modalOpen: BASE_MODAL_OPEN_STATE
      };
      return updateCardById(state, card._id, newInfo, true);
    }
    case types.MARK_UP_TO_DATE_ERROR:
    case types.MARK_OUT_OF_DATE_ERROR: {
      const { cardId, error } = payload;
      return updateCardById(state, cardId, { isMarkingStatus: false, markStatusError: error });
    }

    case types.ADD_BOOKMARK_REQUEST:
    case types.REMOVE_BOOKMARK_REQUEST: {
      return updateActiveCard(state, { isUpdatingBookmark: true, bookmarkError: null });
    }
    case types.ADD_BOOKMARK_SUCCESS:
    case types.REMOVE_BOOKMARK_SUCCESS: {
      const { cardId } = payload;
      return updateCardById(state, cardId, { isUpdatingBookmark: false });
    }
    case types.ADD_BOOKMARK_ERROR:
    case types.REMOVE_BOOKMARK_ERROR: {
      const { cardId, error } = payload;
      return updateCardById(state, cardId, { isUpdatingBookmark: false, bookmarkError: error });
    }

    case types.GET_SLACK_THREAD_REQUEST: {
      return updateActiveCard(state, { isGettingSlackThread: true, getSlackThreadError: null });
    }
    case types.GET_SLACK_THREAD_SUCCESS: {
      const { cardId, slackReplies } = payload;
      const { edits } = getCardById(state, cardId);
      return updateCardById(state, cardId, {
        isGettingSlackThread: false,
        modalOpen: BASE_MODAL_OPEN_STATE,
        slackReplies,
        edits: { ...edits, slackReplies }
      });
    }
    case types.GET_SLACK_THREAD_ERROR: {
      const { cardId, error } = payload;
      return updateCardById(state, cardId, {
        isGettingSlackThread: false,
        getSlackThreadError: error
      });
    }

    case types.CREATE_INVITE_REQUEST: {
      return updateActiveCard(state, { isCreatingInvite: true, createInviteError: null });
    }
    case types.CREATE_INVITE_SUCCESS: {
      const { cardId, invitedUser } = payload;
      const { inviteType, modalOpen, edits } = getCardById(state, cardId);

      const newEdits = { ...edits };
      switch (inviteType) {
        case CARD.INVITE_TYPE.ADD_CARD_OWNER: {
          newEdits.owners = _.unionBy(edits.owners, [invitedUser], '_id');
        }
        // Falls through, as owners are always subscribers
        case CARD.INVITE_TYPE.ADD_CARD_SUBSCRIBER: {
          newEdits.subscribers = _.unionBy(edits.subscribers, [invitedUser], '_id');
          break;
        }
        default:
          break;
      }

      return updateCardById(state, cardId, {
        isCreatingInvite: false,
        modalOpen: { ...modalOpen, [CARD.MODAL_TYPE.INVITE_USER]: false },
        inviteRole: USER.ROLE.VIEWER,
        edits: newEdits
      });
    }
    case types.CREATE_INVITE_ERROR: {
      const { cardId, error } = payload;
      return updateCardById(state, cardId, { isCreatingInvite: false, createInviteError: error });
    }

    case types.CLOSE_ALL_CARDS: {
      return initialState;
    }

    default:
      return state;
  }
}

import _ from 'lodash';
import * as types from 'actions/actionTypes';
import { CARD, USER } from 'appConstants';
import { convertCardToFrontendFormat } from 'utils/card';
import {
  BASE_MODAL_OPEN_STATE,
  BASE_CARD_STATE,
  createCardEdits,
  getCardById,
  updateActiveCard,
  updateActiveCardEdits,
  updateCardById,
  removeCardById,
  updateAttachmentsByKey
} from './utils';

export default function cardRequestsReducer(state, action) {
  const { type, payload = {} } = action;

  switch (type) {
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
      const { activeCard } = state;
      return updateActiveCardEdits(state, {
        attachments: activeCard.edits.attachments.filter((attachment) => attachment.key !== key)
      });
    }
    case types.UPDATE_CARD_ATTACHMENT_NAME: {
      const { key, name } = payload;
      const { activeCard } = state;
      return updateAttachmentsByKey(state, activeCard._id, key, { name });
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
      if (currCard && currCard.status !== CARD.STATUS.NOT_DOCUMENTED) {
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
        modalOpen: { ...BASE_MODAL_OPEN_STATE, [CARD.MODAL_TYPE.EDIT_ACCESS_REQUEST]: false },
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
      const currCard = getCardById(state, cardId);
      return updateCardById(state, cardId, {
        isGettingSlackThread: false,
        modalOpen: BASE_MODAL_OPEN_STATE,
        slackReplies,
        edits: { ..._.get(currCard, 'edits'), slackReplies }
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

    case types.APPROVE_EDIT_ACCESS_REQUEST:
    case types.REJECT_EDIT_ACCESS_REQUEST: {
      return updateActiveCard(state, {
        isUpdatingEditRequests: true,
        editRequestUpdateError: null
      });
    }
    case types.APPROVE_EDIT_ACCESS_ERROR:
    case types.REJECT_EDIT_ACCESS_ERROR: {
      const { cardId, error } = payload;
      return updateCardById(state, cardId, {
        isUpdatingEditRequests: false,
        editRequestUpdateError: error
      });
    }
    case types.APPROVE_EDIT_ACCESS_SUCCESS: {
      const { cardId, requestor } = payload;

      const currCard = getCardById(state, cardId);
      if (!currCard) {
        return state;
      }

      return updateCardById(state, cardId, {
        isUpdatingEditRequests: false,
        editAccessRequests: currCard.editAccessRequests.filter(
          (request) => request.notifier._id !== requestor._id
        ),
        editUserPermissions: _.unionBy(currCard.editUserPermissions, [requestor], '_id'),
        edits: {
          ...currCard.edits,
          editUserPermissions: _.unionBy(currCard.edits.editUserPermissions, [requestor], '_id')
        }
      });
    }
    case types.REJECT_EDIT_ACCESS_SUCCESS: {
      const { cardId, requestorId } = payload;
      const currCard = getCardById(state, cardId);
      const currEditRequests = _.get(currCard, 'editAccessRequests', []);
      return updateCardById(state, cardId, {
        isUpdatingEditRequests: false,
        editAccessRequests: currEditRequests.filter(
          (request) => request.notifier._id !== requestorId
        )
      });
    }

    default:
      return null;
  }
}

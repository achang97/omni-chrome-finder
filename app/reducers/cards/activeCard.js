import _ from 'lodash';
import * as types from 'actions/actionTypes';
import { updateIndex } from 'utils/array';
import { convertCardToFrontendFormat } from 'utils/card';
import {
  updateActiveCard,
  updateActiveCardEdits,
  createCardEdits,
  updateCardById,
  addCardEditsArrayElem,
  removeCardEditsArrayElem
} from './utils';

export default function activeCardReducer(state, action) {
  const { type, payload = {} } = action;

  switch (type) {
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
        { selected: !slackReplies[messageIndex].selected },
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
      const { activeCard } = state;
      return updateActiveCardEdits(state, {
        owners: _.unionBy(activeCard.edits.owners, [owner], '_id'),
        subscribers: _.unionBy(activeCard.edits.subscribers, [owner], '_id')
      });
    }
    case types.REMOVE_CARD_OWNER: {
      const { index } = payload;
      return removeCardEditsArrayElem(state, 'owners', index);
    }

    case types.ADD_CARD_SUBSCRIBER: {
      const { subscriber } = payload;
      return addCardEditsArrayElem(state, 'subscribers', subscriber);
    }
    case types.REMOVE_CARD_SUBSCRIBER: {
      const { index } = payload;
      return removeCardEditsArrayElem(state, 'subscribers', index);
    }

    case types.ADD_CARD_APPROVER: {
      const { approver } = payload;
      return addCardEditsArrayElem(state, 'approvers', approver);
    }
    case types.REMOVE_CARD_APPROVER: {
      const { index } = payload;
      return removeCardEditsArrayElem(state, 'approvers', index);
    }

    case types.ADD_CARD_EDIT_VIEWER: {
      const { viewer } = payload;
      return addCardEditsArrayElem(state, 'editUserPermissions', viewer);
    }
    case types.REMOVE_CARD_EDIT_VIEWER: {
      const { index } = payload;
      return removeCardEditsArrayElem(state, 'editUserPermissions', index);
    }

    case types.UPDATE_CARD_TAGS: {
      const { tags } = payload;
      return updateActiveCardEdits(state, { tags: tags || [] });
    }
    case types.REMOVE_CARD_TAG: {
      const { index } = payload;
      return removeCardEditsArrayElem(state, 'tags', index);
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

    default:
      return null;
  }
}

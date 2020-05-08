import { EditorState } from 'draft-js';
import _ from 'lodash';

import { URL, CARD, PROFILE } from 'appConstants';
import { getEditorStateFromContentState, getContentStateFromEditorState } from './editor';
import { createSelectOptions } from './select';
import { getArrayIds } from './array';
import { isAnyLoading } from './file';
import { copyText } from './window';

export function convertCardToFrontendFormat(card) {
  const {
    contentStateDescription,
    contentStateAnswer,
    keywords,
    updateInterval,
    userPermissions,
    permissionGroups,
    outOfDateReason,
    upvotes,
    slackReplies,
    ...rest
  } = card;

  let verificationInterval = CARD.VERIFICATION_INTERVAL_OPTIONS.find(
    (option) => option.value === updateInterval
  );

  if (!verificationInterval) {
    verificationInterval = CARD.VERIFICATION_INTERVAL_OPTIONS[0];
  }

  let permissionsValue;
  if (userPermissions && userPermissions.length !== 0) {
    permissionsValue = CARD.PERMISSION_OPTION.JUST_ME;
  } else if (permissionGroups && permissionGroups.length !== 0) {
    permissionsValue = CARD.PERMISSION_OPTION.SPECIFIC_GROUPS;
  } else {
    permissionsValue = CARD.PERMISSION_OPTION.ANYONE;
  }

  const permissions = CARD.PERMISSION_OPTIONS.find((option) => option.value === permissionsValue);

  return {
    descriptionEditorState: contentStateDescription
      ? getEditorStateFromContentState(contentStateDescription)
      : EditorState.createEmpty(),
    answerEditorState: contentStateAnswer
      ? getEditorStateFromContentState(contentStateAnswer)
      : EditorState.createEmpty(),
    keywords: createSelectOptions(keywords),
    verificationInterval,
    permissions,
    permissionGroups,
    outOfDateReason,
    upvotes: getArrayIds(upvotes),
    slackThreadIndex: 0,
    slackReplies: slackReplies.map((reply) => ({
      ...reply,
      selected: status !== CARD.STATUS.NOT_DOCUMENTED
    })),
    ...rest
  };
}

export function toggleUpvotes(upvoteIds, userId) {
  const hasUpvoted = upvoteIds.some((upvoteId) => upvoteId === userId);

  let newUpvotes;
  if (!hasUpvoted) {
    newUpvotes = _.union(upvoteIds, [userId]);
  } else {
    newUpvotes = _.without(upvoteIds, userId);
  }

  return newUpvotes;
}

export function hasValidEdits(edits) {
  const {
    question,
    answerEditorState,
    owners = [],
    verificationInterval,
    permissions,
    permissionGroups = [],
    attachments = []
  } = edits;

  return (
    !!question &&
    question !== '' &&
    !!answerEditorState &&
    answerEditorState.getCurrentContent().hasText() &&
    !!permissions &&
    (permissions.value === CARD.PERMISSION_OPTION.JUST_ME ||
      ((permissions.value !== CARD.PERMISSION_OPTION.SPECIFIC_GROUPS ||
        permissionGroups.length !== 0) &&
        owners.length !== 0 &&
        !!verificationInterval)) &&
    !isAnyLoading(attachments)
  );
}

export function generateCardId() {
  return `new-card-${Math.floor(Math.random() * 10001)}`;
}

export function isExistingCard(cardId) {
  return !cardId.startsWith('new-card-');
}

export function isJustMe(permissions) {
  return permissions && permissions.value === CARD.PERMISSION_OPTION.JUST_ME;
}

export function isApprover(user, tags) {
  return (
    user.role === PROFILE.USER_ROLE.ADMIN ||
    tags.every((tag) => !tag.locked || tag.approvers.some((approver) => approver._id === user._id))
  );
}

export function getNewCardBaseState(user) {
  const { _id, firstname, lastname, profilePicture } = user;
  const ownUser = [{ _id, name: `${firstname} ${lastname}`, profilePicture }];
  return {
    owners: ownUser,
    subscribers: ownUser,
    edits: {
      owners: ownUser,
      subscribers: ownUser
    }
  };
}

export function cardStateChanged(card) {
  const editAttributes = Object.entries(card.edits);

  if (editAttributes.length === 0) return false;

  let i;
  for (i = 0; i < editAttributes.length; i++) {
    const [editAttribute, editValue] = editAttributes[i];

    switch (editAttribute) {
      case 'answerEditorState':
      case 'descriptionEditorState': {
        const cardValue = getContentStateFromEditorState(card[editAttribute]).contentState;
        const cardEditValue = getContentStateFromEditorState(editValue).contentState;

        const isNewCard = !isExistingCard(card._id);
        const hasChanged = isNewCard
          ? editValue.getCurrentContent().hasText()
          : cardValue !== cardEditValue;
        if (hasChanged) {
          return true;
        }
        break;
      }
      default: {
        if (JSON.stringify(card[editAttribute]) !== JSON.stringify(editValue)) {
          return true;
        }
        break;
      }
    }
  }

  return false;
}

export function copyCardUrl(cardId) {
  copyText(`${URL.EXTENSION}?cardId=${cardId}`);
}

export default {
  convertCardToFrontendFormat,
  toggleUpvotes,
  hasValidEdits,
  generateCardId,
  isExistingCard,
  isJustMe,
  cardStateChanged,
  copyCardUrl
};

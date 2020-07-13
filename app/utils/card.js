import _ from 'lodash';

import { URL, CARD, PROFILE } from 'appConstants';

import { getArrayIds } from './array';
import { isAnyLoading } from './file';
import { isActiveUser } from './user';
import { copyText } from './window';

export function convertCardToFrontendFormat(card) {
  const {
    answerModel,
    updateInterval,
    userPermissions,
    permissionGroups,
    outOfDateReason,
    upvotes,
    slackReplies,
    status,
    ...rest
  } = card;

  let verificationInterval = CARD.VERIFICATION_INTERVAL_OPTIONS.find(
    (option) => option.value === updateInterval
  );

  if (!verificationInterval) {
    verificationInterval = CARD.VERIFICATION_INTERVAL_OPTIONS[0];
  }

  const permissions = convertPermissionsToFrontendFormat(userPermissions, permissionGroups);

  return {
    answerModel: answerModel || '',
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
    status,
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

export function convertPermissionsToBackendFormat(userId, permissions, permissionGroups) {
  const permissionsInfo = {
    userPermissions: permissions.value === CARD.PERMISSION_OPTION.JUST_ME ? [userId] : [],
    permissionGroups:
      permissions.value === CARD.PERMISSION_OPTION.SPECIFIC_GROUPS ? permissionGroups : []
  };
  return permissionsInfo;
}

export function convertPermissionsToFrontendFormat(userPermissions, permissionGroups) {
  let permissionsValue;
  if (userPermissions && userPermissions.length !== 0) {
    permissionsValue = CARD.PERMISSION_OPTION.JUST_ME;
  } else if (permissionGroups && permissionGroups.length !== 0) {
    permissionsValue = CARD.PERMISSION_OPTION.SPECIFIC_GROUPS;
  } else {
    permissionsValue = CARD.PERMISSION_OPTION.ANYONE;
  }

  return CARD.PERMISSION_OPTIONS.find((option) => option.value === permissionsValue);
}

export function hasValidPermissions(permissions, permissionGroups) {
  return (
    !!permissions &&
    (permissions.value !== CARD.PERMISSION_OPTION.SPECIFIC_GROUPS || permissionGroups.length !== 0)
  );
}

export function hasValidEdits(edits, isExternal = false) {
  const {
    question,
    answerModel,
    owners = [],
    verificationInterval,
    permissions,
    permissionGroups = [],
    attachments = []
  } = edits;

  return (
    !!question &&
    question !== '' &&
    (isExternal || !!answerModel) &&
    hasValidPermissions(permissions, permissionGroups) &&
    owners.filter(isActiveUser).length !== 0 &&
    !!verificationInterval &&
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

export function isApprover(user) {
  // TODO: Change this function so it actually checks the assigned approvers on the card
  return user.role === PROFILE.USER_ROLE.ADMIN;
}

export function getNewCardBaseState(user) {
  const ownUser = [user];
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
    if (JSON.stringify(card[editAttribute]) !== JSON.stringify(editValue)) {
      return true;
    }
  }

  return false;
}

export function copyCardUrl(cardId) {
  copyText(`${URL.EXTENSION}?cardId=${cardId}`);
}

export function isExternalCard(card) {
  return !!card.externalLinkAnswer;
}

export function isSlackCard(card) {
  const { slackThreadConvoPairs = [], slackReplies = [] } = card;
  return slackThreadConvoPairs.length !== 0 || slackReplies.length !== 0;
}

export function getDraggableStyle(isDragging, draggableStyle, windowPosition) {
  const { top, left, ...rest } = draggableStyle;

  if (!top || !left) {
    return rest;
  }

  return {
    // styles we need to apply on draggables
    top: top - windowPosition.y,
    left: left - windowPosition.x,
    ...rest
  };
}

export default {
  convertCardToFrontendFormat,
  toggleUpvotes,
  convertPermissionsToFrontendFormat,
  convertPermissionsToBackendFormat,
  hasValidPermissions,
  hasValidEdits,
  generateCardId,
  isExistingCard,
  isJustMe,
  isApprover,
  getNewCardBaseState,
  cardStateChanged,
  isExternalCard,
  isSlackCard,
  copyCardUrl,
  getDraggableStyle
};

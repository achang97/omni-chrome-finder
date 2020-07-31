import _ from 'lodash';
import queryString from 'query-string';

import { URL, CARD, REQUEST } from 'appConstants';

import { getArrayIds } from './array';
import { isEditor } from './auth';
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
    attachments,
    ...rest
  } = card;

  let verificationInterval = CARD.VERIFICATION_INTERVAL_OPTIONS.find(
    (option) => option.value === updateInterval
  );

  if (!verificationInterval) {
    verificationInterval = CARD.VERIFICATION_INTERVAL_OPTIONS[0];
  }

  const permissions = convertPermissionsToFrontendFormat(userPermissions, permissionGroups);
  const externalAttachments = attachments.filter(({ inline }) => !inline);

  return {
    answerModel: answerModel || '',
    verificationInterval,
    permissions,
    permissionGroups,
    outOfDateReason,
    upvotes: getArrayIds(upvotes),
    attachments: externalAttachments,
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

export function getInlineAttachments(answerModel) {
  // NOTE: This is not a perfect approach, as it just checks for
  // urls and could potentially result in false positives (ie. if someone
  // just pasted a link to one of these attachments. However, this logic should be ok for now.
  const replaceSlashRegex = new RegExp('/', 'g');
  const baseUrl = REQUEST.URL.SERVER.replace(replaceSlashRegex, '\\/');

  const pattern = `"${baseUrl}\\/files\\/bytoken\\/([^?"]+)\\?token=[^"]+"`;
  const regexp = new RegExp(pattern, 'g');

  const matches = [...answerModel.matchAll(regexp)];

  const attachments = [];
  [...matches].forEach((match) => {
    attachments.push({ key: match[1], inline: true });
  });

  return attachments;
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

export function isJustMe(permissions) {
  return permissions && permissions.value === CARD.PERMISSION_OPTION.JUST_ME;
}

export function hasValidPermissions(permissions, permissionGroups) {
  return (
    !!permissions &&
    (permissions.value !== CARD.PERMISSION_OPTION.SPECIFIC_GROUPS || permissionGroups.length !== 0)
  );
}

export function hasValidEdits(card) {
  const isExternal = isExternalCard(card);
  const {
    edits: {
      question,
      answerModel,
      owners = [],
      verificationInterval,
      permissions,
      permissionGroups = [],
      attachments = []
    }
  } = card;

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

export function canEditCard(user, card) {
  const { _id: userId } = user;
  const { asker = {}, owners = [], editUserPermissions = [] } = card;
  return (
    isEditor(user) ||
    asker._id === userId ||
    owners.some(({ _id }) => _id === userId) ||
    editUserPermissions.some(({ _id }) => _id === userId)
  );
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

export function getCardUrlParams(url) {
  if (!url.startsWith(URL.EXTENSION)) {
    return null;
  }

  const searchParams = url.substring(url.indexOf('?') + 1);
  return queryString.parse(searchParams);
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
  getInlineAttachments,
  convertPermissionsToFrontendFormat,
  convertPermissionsToBackendFormat,
  hasValidPermissions,
  hasValidEdits,
  generateCardId,
  isExistingCard,
  isJustMe,
  getNewCardBaseState,
  cardStateChanged,
  isExternalCard,
  isSlackCard,
  copyCardUrl,
  getCardUrlParams,
  getDraggableStyle
};

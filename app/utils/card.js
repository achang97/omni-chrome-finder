import { EditorState } from 'draft-js';
import _ from 'lodash';

import { getEditorStateFromContentState, getContentStateFromEditorState } from './editor';
import { createSelectOptions } from './select';
import { getArrayIds } from './array';
import {
  VERIFICATION_INTERVAL_OPTIONS, PERMISSION_OPTION,
  PERMISSION_OPTIONS, CARD_STATUS
} from './constants';

export function convertCardToFrontendFormat(card) {
  const {
    contentStateDescription, contentStateAnswer, keywords,
    updateInterval, userPermissions, permissionGroups, outOfDateReason,
    upvotes, slackReplies, ...rest
  } = card;

  let verificationInterval = VERIFICATION_INTERVAL_OPTIONS.find(option => (
    option.value === updateInterval
  ));

  if (!verificationInterval) {
    verificationInterval = VERIFICATION_INTERVAL_OPTIONS[0];
  }

  let permissionsValue;
  if (userPermissions && userPermissions.length !== 0) {
    permissionsValue = PERMISSION_OPTION.JUST_ME;
  } else if (permissionGroups && permissionGroups.length !== 0) {
    permissionsValue = PERMISSION_OPTION.SPECIFIC_GROUPS;
  } else {
    permissionsValue = PERMISSION_OPTION.ANYONE;
  }

  const permissions = PERMISSION_OPTIONS.find(option => option.value === permissionsValue);

  return {
    descriptionEditorState: contentStateDescription ?
      getEditorStateFromContentState(contentStateDescription) :
      EditorState.createEmpty(),
    answerEditorState: contentStateAnswer ?
      getEditorStateFromContentState(contentStateAnswer) :
      EditorState.createEmpty(),
    keywords: createSelectOptions(keywords),
    verificationInterval,
    permissions,
    permissionGroups,
    outOfDateReason,
    upvotes: getArrayIds(upvotes),
    slackThreadIndex: 0,
    slackReplies: slackReplies.map(reply => ({
      ...reply,
      selected: status !== CARD_STATUS.NOT_DOCUMENTED
    })),
    ...rest,
  };
}

export function toggleUpvotes(upvoteIds, userId) {
  const hasUpvoted = upvoteIds.some(upvoteId => upvoteId === userId);

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
    question, answerEditorState, owners = [], verificationInterval,
    permissions, permissionGroups = []
  } = edits;

  return (
    (!!question && question !== '') &&
    (!!answerEditorState && answerEditorState.getCurrentContent().hasText()) &&
    (!!permissions && (
      permissions.value === PERMISSION_OPTION.JUST_ME ||
      ((permissions.value !== PERMISSION_OPTION.SPECIFIC_GROUPS || permissionGroups.length !== 0) &&
        owners.length !== 0 &&
        !!verificationInterval
      )
    ))
  );
}

export function generateCardId() {
  return `new-card-${Math.floor(Math.random() * 10001)}`;
}

export function isExistingCard(id) {
  return !id.startsWith('new-card-');
}

export function isJustMe(permissions) {
  return permissions && permissions.value === PERMISSION_OPTION.JUST_ME;
}

export function cardStateChanged(card) {
  const editAttributes = Object.keys(card.edits);

  if (editAttributes.length === 0) return false;

  let i;
  for (i = 0; i < editAttributes.length; i++) {
    const editAttribute = editAttributes[i];

    if (editAttribute === 'answerEditorState' || editAttribute === 'descriptionEditorState') {
      const cardValue = getContentStateFromEditorState(card[editAttribute]).contentState;
      const cardEditValue = getContentStateFromEditorState(card.edits[editAttribute]).contentState;
      if (cardValue !== cardEditValue) return true;
    } else if (JSON.stringify(card[editAttribute]) !== JSON.stringify(card.edits[editAttribute])) {
      return true;
    }
  }

  return false;
}

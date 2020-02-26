import { getEditorStateFromContentState } from './editorHelpers';
import { EditorState } from 'draft-js';
import { createSelectOptions } from './selectHelpers';
import { getArrayIds } from './arrayHelpers';
import { AUTO_REMIND_VALUE, VERIFICATION_INTERVAL_OPTIONS, PERMISSION_OPTION, PERMISSION_OPTIONS, CARD_STATUS } from './constants';
import _ from 'underscore';

export function convertCardToFrontendFormat(card) {
	const { content_state_description, content_state_answer, keywords, autoupdate, update_interval, user_permissions, permission_groups, status, out_of_date_reason, upvotes, slackReplies, /* screenrecording_urls, screenshot_urls, */ ...rest } = card;

	const verificationInterval = VERIFICATION_INTERVAL_OPTIONS.find(option => (
		option.value === (autoupdate ? AUTO_REMIND_VALUE : update_interval)
	));

	let permissionsValue;
	if (user_permissions.length !== 0) {
		permissionsValue = PERMISSION_OPTION.JUST_ME;
	} else if (permission_groups.length !== 0) {
		permissionsValue = PERMISSION_OPTION.SPECIFIC_GROUPS;
	} else {
		permissionsValue = PERMISSION_OPTION.ANYONE;
	}

	const permissions = PERMISSION_OPTIONS.find(option => option.value === permissionsValue);

	return {
		descriptionEditorState: content_state_description ? getEditorStateFromContentState(content_state_description) : EditorState.createEmpty(),
		answerEditorState: content_state_answer ? getEditorStateFromContentState(content_state_answer) : EditorState.createEmpty(),
		keywords: createSelectOptions(keywords),
		verificationInterval,
		permissions,
		permissionGroups: permission_groups,
		cardStatus: status,
		outOfDateReason: out_of_date_reason,
		upvotes: getArrayIds(upvotes),
		slackReplies: slackReplies.map(reply => ({ ...reply, selected: status !== CARD_STATUS.NOT_DOCUMENTED })),
		...rest,

		/* TBD */
		attachments: [],
	}
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

export function isValidCard(edits) {
	const { question, answerEditorState, owners=[], verificationInterval, permissions, permissionGroups=[] } = edits;
	return (
		(!!question && question !== '') &&
		(!!answerEditorState && answerEditorState.getCurrentContent().hasText()) &&
        owners.length !== 0 &&
        !!verificationInterval &&
        (!!permissions && (permissions.value !== PERMISSION_OPTION.SPECIFIC_GROUPS || permissionGroups.length !== 0))
	)
}

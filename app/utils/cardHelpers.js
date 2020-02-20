import { getEditorStateFromContentState } from './editorHelpers';
import { createSelectOptions } from './selectHelpers';
import { getArrayIds } from './arrayHelpers';
import { AUTO_REMIND_VALUE, VERIFICATION_INTERVAL_OPTIONS, PERMISSION_OPTIONS_MAP, PERMISSION_OPTIONS } from './constants';
import _ from 'underscore';

export function convertCardToFrontendFormat(card) {
	const { content_state_description, content_state_answer, keywords, autoupdate, update_interval, user_permissions, permission_groups, status, upvotes, /* screenrecording_urls, screenshot_urls, */ ...rest } = card;

	const verificationInterval = VERIFICATION_INTERVAL_OPTIONS.find(option => (
		option.value === (autoupdate ? AUTO_REMIND_VALUE : update_interval)
	));

	let permissionsValue;
	if (user_permissions.length !== 0) {
		permissionsValue = PERMISSION_OPTIONS_MAP.JUST_ME;
	} else if (permission_groups.length !== 0) {
		permissionsValue = PERMISSION_OPTIONS_MAP.SPECIFIC_GROUPS;
	} else {
		permissionsValue = PERMISSION_OPTIONS_MAP.ANYONE;
	}

	const permissions = PERMISSION_OPTIONS.find(option => option.value === permissionsValue);

	return {
		descriptionEditorState: getEditorStateFromContentState(content_state_description),
		answerEditorState: getEditorStateFromContentState(content_state_answer),
		keywords: createSelectOptions(keywords),
		verificationInterval,
		permissions,
		permissionGroups: permission_groups,
		cardStatus: status,
		upvotes: getArrayIds(upvotes),
		...rest,

		/* TBD */
		messages: [],
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
        (!!permissions && (permissions.value !== PERMISSION_OPTIONS_MAP.SPECIFIC_GROUPS || permissionGroups.length !== 0))
	)
}

// Messages
export const CHROME_MESSAGES = {
	TOGGLE: 'TOGGLE',
	TAB_UPDATE: 'TAB_UPDATE',
}

// Debounce / Animations
export const DEBOUNCE_60_HZ = 166;

export const FADE_IN_TRANSITIONS = {
	entering: { opacity: 1 },
	entered:  { opacity: 1 },
	exiting:  { opacity: 0 },
	exited:  { opacity: 0 },	
}

// Ask page constants
export const ASK_INTEGRATIONS = ['Slack', 'Email', 'Asana'];

// Card page constants
export const CARD_DIMENSIONS = {
	MIN_QUESTION_HEIGHT: 180,
	TABS_HEIGHT: 51,
	MIN_ANSWER_HEIGHT: 180,
	DEFAULT_CARDS_WIDTH: 660,
	DEFAULT_CARDS_HEIGHT: 500
}

export const MODAL_TYPE = {
	THREAD: 'THREAD',
	CREATE: 'CREATE',
	CONFIRM_CLOSE: 'CONFIRM_CLOSE',
	CONFIRM_CLOSE_UNDOCUMENTED: 'CONFIRM_CLOSE_UNDOCUMENTED',
	CONFIRM_UP_TO_DATE: 'CONFIRM_UP_TO_DATE',
	CONFIRM_UP_TO_DATE_SAVE: 'CONFIRM_UP_TO_DATE_SAVE',
}


export const EDITOR_TYPE = {
	DESCRIPTION: 'DESCRIPTION',
	ANSWER: 'ANSWER',
}

export const CARD_STATUS_OPTIONS = {
	NOT_DOCUMENTED: 'NOT_DOCUMENTED',
	NEEDS_APPROVAL: 'NEEDS_APPROVAL',
	OUT_OF_DATE: 'OUT_OF_DATE',
	NEEDS_VERIFICATION: 'NEEDS_VERIFICATION',
	UP_TO_DATE: 'UP_TO_DATE',
}

export const VERIFICATION_INTERVAL_OPTIONS = [
	'Auto-Remind',
	'1 Week',
	'2 Weeks',
	'1 Month',
	'6 Months',
	'1 Year',
	'Never'
]
export const PERMISSION_OPTIONS = [
	'Whole Organization',
	'My Team',
	'Just Me',
]
export const TAG_OPTIONS = [
	{ id: 1, tag: 'Customer Onboarding', isLocked: true },
	{ id: 2, tag: 'Sales', isLocked: false },
	{ id: 3, tag: 'Engineering', isLocked: true },
	{ id: 4, tag: 'Product', isLocked: false },
	{ id: 5, tag: 'Hiring', isLocked: true },
	{ id: 6, tag: 'Top Priority', isLocked: false },
	{ id: 7, tag: 'Outreach', isLocked: false },
]
export const USER_OPTIONS = [
	{ id: 1, name: 'Andrew Chang', img: null },
	{ id: 2, name: 'Akshay Ramaswamy', img: 'data:image/jpeg;base64,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'},
	{ id: 3, name: 'Chetan Rane', img: 'data:image/jpeg;base64,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'},
	{ id: 4, name: 'Brian Skinner', img: null},
	{ id: 5, name: 'Kiran Rane', img: null},
	{ id: 6, name: 'Tatie Balabanis', img: null},
	{ id: 7, name: 'Antonio Brown', img: null},
]

// Misc.
const NOOP = () => {};
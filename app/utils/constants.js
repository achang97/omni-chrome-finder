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
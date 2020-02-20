// Function to get storage key names
export const getStorageName = (name) => `OMNI_EXTENSION_${name}`;

// Messages
export const CHROME_MESSAGES = {
	TOGGLE: 'TOGGLE',
	TAB_UPDATE: 'TAB_UPDATE',
}

// Debounce / Animations
export const DEBOUNCE_60_HZ = 166;
export const DEBOUNCE_300_MS = 300;

export const FADE_IN_TRANSITIONS = {
	entering: { opacity: 1 },
	entered:  { opacity: 1 },
	exiting:  { opacity: 0 },
	exited:  { opacity: 0 },	
}

// Ask page constants
export const ASK_INTEGRATIONS = ['Slack', 'Email', 'Asana'];

// Navigate page constants
export const NAVIGATE_TAB_OPTIONS = ['All', 'My Cards', 'Bookmarked'];

// Tasks page constants
export const TASKS_TAB_OPTIONS = ['Unresolved', 'Needs Approval'];

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
	ERROR_UPDATE: 'ERROR_UPDATE',
	ERROR_UPDATE_CLOSE: 'ERROR_UPDATE_CLOSE',
	ERROR_DELETE: 'ERROR_DELETE',
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
	UP_TO_DATE: 1,
	OUT_OF_DATE: 2,
	NEEDS_VERIFICATION: 3,
	NEEDS_APPROVAL: 4,
	NOT_DOCUMENTED: 5,
}

export const AUTO_REMIND_VALUE = -1;
export const VERIFICATION_INTERVAL_OPTIONS = [
	{ label: 'Auto-Remind', value: AUTO_REMIND_VALUE },
	{ label: '2 Weeks', value: 1 },
	{ label: '1 Month', value: 2 },
	{ label: '3 Months', value: 3 },
	{ label: '6 Months', value: 4 },
	{ label: '1 Year', value: 5 },
]

export const PERMISSION_OPTIONS_MAP = {
	ANYONE: 'ANYONE',
	JUST_ME: 'JUST_ME',
	SPECIFIC_GROUPS: 'SPECIFIC_GROUPS',	
}
export const PERMISSION_OPTIONS = [
	{ label: 'Anyone', value: PERMISSION_OPTIONS_MAP.ANYONE },
	{ label: 'Just Me', value: PERMISSION_OPTIONS_MAP.JUST_ME },
	{ label: 'Specific Groups', value: PERMISSION_OPTIONS_MAP.SPECIFIC_GROUPS },
]

// Search types
export const SEARCH_TYPES = {
	POPOUT: 'POPOUT',
	SIDEBAR: 'SIDEBAR',
	CARDS: 'CARDS',
}

// Misc.
const NOOP = () => {};
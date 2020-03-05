// General app constants
export const getStorageName = (name) => `OMNI_EXTENSION_${name}`;

export const CHROME_MESSAGE = {
	TOGGLE: 'TOGGLE',
	TAB_UPDATE: 'TAB_UPDATE',
}

export const CARD_URL_BASE = 'https://www.google.com/webhp?sxsrf=';
export const CARD_URL_REGEX = /https:\/\/www\.google\.com\/webhp\?sxsrf=([A-Za-z0-9]{24})/;

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

export const SLACK_RECIPIENT_TYPE = {
	CHANNEL: 'channel',
	USER: 'user',
}

// Navigate page constants
export const NAVIGATE_TAB_OPTION = {
	ALL: 'All',
	MY_CARDS: 'My Cards',
	BOOKMARKED: 'Bookmarked',
}
export const NAVIGATE_TAB_OPTIONS = [NAVIGATE_TAB_OPTION.ALL, NAVIGATE_TAB_OPTION.MY_CARDS, NAVIGATE_TAB_OPTION.BOOKMARKED];

// Profile Page Constants
export const INTEGRATIONS = {
	GOOGLE: "google",
	SLACK : "slack",
}
export const AUTOFIND_PERMISSIONS = {
	ZENDESK: "zendesk",
	HELPSCOUT: "helpscout",
}
export const PROFILE_SETTING_SECTIONS = {
	KNOWLEDGE_BASE_INTEGRATIONS: { 
		title: "Knowledge Base Integrations",
		integrations: [INTEGRATIONS.GOOGLE],
	},
	COMMUNICATION_INTEGRATIONS: {
		title: "Communication Integrations",
		integrations: [INTEGRATIONS.SLACK],
	},
	AUTOFIND_PERMISSIONS: {
		title: "Autofind Permissions",
		permissions: [ AUTOFIND_PERMISSIONS.ZENDESK, AUTOFIND_PERMISSIONS.HELPSCOUT ],
	}
}

// Card page constants
export const CARD_DIMENSIONS = {
	MIN_QUESTION_HEIGHT: 180,
	TABS_HEIGHT: 51,
	MIN_ANSWER_HEIGHT: 180,
	DEFAULT_CARDS_WIDTH: 660,
	DEFAULT_CARDS_HEIGHT: 500
}

export const MODAL_TYPE = {
	CREATE: 'CREATE',
	THREAD: 'THREAD',
	ERROR_UPDATE: 'ERROR_UPDATE',
	ERROR_UPDATE_CLOSE: 'ERROR_UPDATE_CLOSE',
	ERROR_DELETE: 'ERROR_DELETE',
	CONFIRM_CLOSE: 'CONFIRM_CLOSE',
	CONFIRM_CLOSE_UNDOCUMENTED: 'CONFIRM_CLOSE_UNDOCUMENTED',
	CONFIRM_UP_TO_DATE: 'CONFIRM_UP_TO_DATE',
	CONFIRM_OUT_OF_DATE: 'CONFIRM_OUT_OF_DATE',
	CONFIRM_UP_TO_DATE_SAVE: 'CONFIRM_UP_TO_DATE_SAVE',
	CONFIRM_DELETE: 'CONFIRM_DELETE',
	CONFIRM_CLOSE_EDIT: 'CONFIRM_CLOSE_EDIT',
}

export const EDITOR_TYPE = {
	DESCRIPTION: 'DESCRIPTION',
	ANSWER: 'ANSWER',
}

export const CARD_STATUS = {
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

export const PERMISSION_OPTION = {
	ANYONE: 'ANYONE',
	JUST_ME: 'JUST_ME',
	SPECIFIC_GROUPS: 'SPECIFIC_GROUPS',	
}
export const PERMISSION_OPTIONS = [
	{ label: 'Anyone', value: PERMISSION_OPTION.ANYONE },
	{ label: 'Just Me', value: PERMISSION_OPTION.JUST_ME },
	{ label: 'Specific Groups', value: PERMISSION_OPTION.SPECIFIC_GROUPS },
]

// Tasks page constants
export const TASKS_TAB_OPTIONS = ['Unresolved', 'Needs Approval'];

export const TASKS_TYPES = {
	NEEDS_VERIFICATION: CARD_STATUS.NEEDS_VERIFICATION,
	OUT_OF_DATE: CARD_STATUS.OUT_OF_DATE,
	UNDOCUMENTED: CARD_STATUS.NOT_DOCUMENTED,
	NEEDS_APPROVAL: CARD_STATUS.NEEDS_APPROVAL,
};

export const TASKS_SECTIONS = {
	ALL: { title: "All Tasks", types: [ TASKS_TYPES.NEEDS_VERIFICATION, TASKS_TYPES.OUT_OF_DATE, TASKS_TYPES.UNDOCUMENTED ] },
	NEEDS_VERIFICATION: { title: "Needs Verification", types: [ TASKS_TYPES.NEEDS_VERIFICATION ] },
	OUT_OF_DATE: { title: "Out of Date", types: [ TASKS_TYPES.OUT_OF_DATE ] },
	UNDOCUMENTED: { title: "Undocumented Questions", types: [ TASKS_TYPES.UNDOCUMENTED ] },
};

// Search constants
export const SEARCH_TYPE = {
	POPOUT: 'POPOUT',
	NAVIGATE: 'NAVIGATE',
}

export const SEARCH_INFINITE_SCROLL_OFFSET = 100;

export const DOCUMENTATION_TYPE = {
	GOOGLE_DRIVE: 'Google Drive',
}


// Misc.
const NOOP = () => {};
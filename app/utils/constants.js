// General app constants
export const CHROME_MESSAGE = {
  TOGGLE: 'TOGGLE',
  TAB_UPDATE: 'TAB_UPDATE',
  SEARCH: 'SEARCH',
  ASK: 'ASK',
  CREATE: 'CREATE',
  NOTIFICATION_OPENED: 'NOTIFICATION_OPENED',
};

export const MAIN_CONTAINER_ID = 'omni-chrome-ext-main-container';

export const CARD_URL_BASE = 'https://www.google.com/webhp?sxsrf=';
export const CARD_URL_REGEX = /^https:\/\/www\.google\.com\/webhp\?sxsrf=([A-Za-z0-9]{24})$/;
export const SLACK_URL_REGEX = /^https:\/\/www\.google\.com\/webhp\?sxsrf=$/;

export const TASK_URL_BASE = 'https://www.google.com/webhp?tasksxsrf=';
export const TASK_URL_REGEX = /^https:\/\/www\.google\.com\/webhp\?tasksxsrf=([A-Za-z0-9]{24})$/;

export const SLACK_AUTH_URL = `https://slack.com/oauth/v2/authorize?client_id=902571434263.${process.env.NODE_ENV === 'development' ? '1009616749152' : '910615559953'}&scope=app_mentions:read,channels:history,channels:join,channels:read,chat:write,commands,files:read,groups:history,groups:read,im:history,im:read,im:write,links:read,mpim:history,mpim:read,mpim:write,reminders:read,reminders:write,remote_files:read,remote_files:share,remote_files:write,team:read,usergroups:read,usergroups:write,users.profile:read,users:read,users:read.email,users:write&user_scope=channels:history,channels:read,channels:write,chat:write,emoji:read,files:read,groups:history,groups:read,groups:write,im:history,im:read,im:write,links:read,links:write,mpim:history,mpim:read,mpim:write,reactions:read,reminders:read,reminders:write,remote_files:read,remote_files:share,search:read,team:read,usergroups:read,usergroups:write,users.profile:read,users:read,users:read.email,users:write&state=`;

// Debounce / Animations
export const DEBOUNCE_60_HZ = 166;
export const DEBOUNCE_300_MS = 300;

export const TIMEOUT_3S = 3000;

export const FADE_IN_TRANSITIONS = {
  entering: { opacity: 1 },
  entered: { opacity: 1 },
  exiting: { opacity: 0 },
  exited: { opacity: 0 },
};

// User constants
export const USER_ROLE = {
  ADMIN: 'Admin',
  MEMBER: 'Member'
}

// General constants
export const INTEGRATIONS = {
  GOOGLE: 'google',
  SLACK: 'slack',
  EMAIL: 'email',
  ASANA: 'asana',
  ZENDESK: 'zendesk',
  HELPSCOUT: 'helpscout',
};

// Ask page constants
export const ASK_INTEGRATIONS = [INTEGRATIONS.SLACK, INTEGRATIONS.EMAIL, INTEGRATIONS.ASANA];

export const SLACK_RECIPIENT_TYPE = {
  CHANNEL: 'channel',
  USER: 'user',
};

// Navigate page constants
export const NAVIGATE_TAB_OPTION = {
  ALL: 'All',
  MY_CARDS: 'My Cards',
  BOOKMARKED: 'Bookmarked',
};
export const NAVIGATE_TAB_OPTIONS = [
  NAVIGATE_TAB_OPTION.ALL,
  NAVIGATE_TAB_OPTION.MY_CARDS,
  NAVIGATE_TAB_OPTION.BOOKMARKED
];

// Profile Page Constants
export const PROFILE_SETTING_SECTION_TYPE = {
  KNOWLEDGE_BASE: 'KNOWLEDGE_BASE',
  COMMUNICATION: 'COMMUNICATION',
  AUTOFIND: 'AUTOFIND',
};
export const PROFILE_SETTING_SECTIONS = [
  {
    type: PROFILE_SETTING_SECTION_TYPE.KNOWLEDGE_BASE,
    title: 'Knowledge Base Integrations',
    integrations: [INTEGRATIONS.GOOGLE, INTEGRATIONS.ZENDESK],
  },
  {
    type: PROFILE_SETTING_SECTION_TYPE.COMMUNICATION,
    title: 'Communication Integrations',
    integrations: [INTEGRATIONS.SLACK],
  },
  {
    type: PROFILE_SETTING_SECTION_TYPE.AUTOFIND,
    title: 'Autofind Permissions',
    permissions: [INTEGRATIONS.ZENDESK, INTEGRATIONS.HELPSCOUT],
  }
];

export const PROFILE_NOTIFICATIONS_OPTIONS = {
  EMAIL: 'email',
  SLACK: 'slack',
  CHROME: 'chrome'
}

// Card page constants
export const CARD_DIMENSIONS = {
  MIN_QUESTION_HEIGHT: 180,
  TABS_HEIGHT: 51,
  MIN_ANSWER_HEIGHT: 180,
  DEFAULT_CARDS_WIDTH: 660,
  DEFAULT_CARDS_HEIGHT: 500
};

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
  CONFIRM_APPROVE: 'CONFIRM_APPROVE',
  CONFIRM_DELETE: 'CONFIRM_DELETE',
  CONFIRM_CLOSE_EDIT: 'CONFIRM_CLOSE_EDIT',
};

export const EDITOR_TYPE = {
  DESCRIPTION: 'DESCRIPTION',
  ANSWER: 'ANSWER',
};

export const CARD_STATUS = {
  UP_TO_DATE: 1,
  OUT_OF_DATE: 2,
  NEEDS_VERIFICATION: 3,
  NEEDS_APPROVAL: 4,
  NOT_DOCUMENTED: 5,
};

export const VERIFICATION_INTERVAL_OPTIONS = [
  { label: 'Auto-Remind', value: 6 },
  { label: '2 Weeks', value: 1 },
  { label: '1 Month', value: 2 },
  { label: '3 Months', value: 3 },
  { label: '6 Months', value: 4 },
  { label: '1 Year', value: 5 },
  { label: 'Never', value: 7 },
];

export const PERMISSION_OPTION = {
  ANYONE: 'ANYONE',
  JUST_ME: 'JUST_ME',
  SPECIFIC_GROUPS: 'SPECIFIC_GROUPS',
};
export const PERMISSION_OPTIONS = [
  { label: 'Anyone', value: PERMISSION_OPTION.ANYONE },
  { label: 'Just Me', value: PERMISSION_OPTION.JUST_ME },
  { label: 'Specific Groups', value: PERMISSION_OPTION.SPECIFIC_GROUPS },
];

// Tasks page constants
export const TASK_TYPE = {
  NEEDS_VERIFICATION: CARD_STATUS.NEEDS_VERIFICATION,
  OUT_OF_DATE: CARD_STATUS.OUT_OF_DATE,
  UNDOCUMENTED: CARD_STATUS.NOT_DOCUMENTED,
  NEEDS_APPROVAL: CARD_STATUS.NEEDS_APPROVAL,
};

export const TASKS_TAB_OPTIONS = ['Unresolved', 'Needs Approval'];

export const TASKS_SECTION_TYPE = {
  ALL: 'ALL',
  NEEDS_VERIFICATION: 'NEEDS_VERIFICATION',
  OUT_OF_DATE: 'OUT_OF_DATE',
  UNDOCUMENTED: 'UNDOCUMENTED',
  NEEDS_APPROVAL: 'NEEDS_APPROVAL',
};

export const TASKS_SECTIONS = [
  {
    type: TASKS_SECTION_TYPE.ALL,
    title: 'All Tasks',
    taskTypes: [TASK_TYPE.NEEDS_VERIFICATION, TASK_TYPE.OUT_OF_DATE, TASK_TYPE.UNDOCUMENTED]
  },
  {
    type: TASKS_SECTION_TYPE.NEEDS_VERIFICATION,
    title: 'Needs Verification',
    taskTypes: [TASK_TYPE.NEEDS_VERIFICATION]
  },
  {
    type: TASKS_SECTION_TYPE.OUT_OF_DATE,
    title: 'Out of Date',
    taskTypes: [TASK_TYPE.OUT_OF_DATE]
  },
  {
    type: TASKS_SECTION_TYPE.UNDOCUMENTED,
    title: 'Undocumented Questions',
    taskTypes: [TASK_TYPE.UNDOCUMENTED]
  },
];

// Search constants
export const SEARCH_TYPE = {
  POPOUT: 'POPOUT',
  NAVIGATE: 'NAVIGATE',
  AI_SUGGEST: 'AI_SUGGEST',
};

// Misc.
export const NOOP = () => {};

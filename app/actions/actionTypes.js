// Auth
export const UPDATE_LOGIN_EMAIL = 'UPDATE_LOGIN_EMAIL';
export const UPDATE_LOGIN_PASSWORD = 'UPDATE_LOGIN_PASSWORD';

export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_ERROR = 'LOGIN_ERROR';

export const UPDATE_SIGNUP_FIRST_NAME = 'UPDATE_SIGNUP_FIRST_NAME';
export const UPDATE_SIGNUP_LAST_NAME = 'UPDATE_SIGNUP_LAST_NAME';
export const UPDATE_SIGNUP_EMAIL = 'UPDATE_SIGNUP_EMAIL';
export const UPDATE_SIGNUP_PASSWORD = 'UPDATE_SIGNUP_PASSWORD';

export const SIGNUP_REQUEST = 'SIGNUP_REQUEST';
export const SIGNUP_SUCCESS = 'SIGNUP_SUCCESS';
export const SIGNUP_ERROR = 'SIGNUP_ERROR';

export const UPDATE_RECOVERY_EMAIL = 'UPDATE_RECOVERY_EMAIL';
export const SEND_RECOVERY_EMAIL_REQUEST = 'SEND_RECOVERY_EMAIL_REQUEST';
export const SEND_RECOVERY_EMAIL_SUCCESS = 'SEND_RECOVERY_EMAIL_SUCCESS';
export const SEND_RECOVERY_EMAIL_ERROR = 'SEND_RECOVERY_EMAIL_ERROR';

export const UPDATE_VERIFICATION_CODE = 'UPDATE_VERIFICATION_CODE';

export const VERIFY_REQUEST = 'VERIFY_REQUEST';
export const VERIFY_SUCCESS = 'VERIFY_SUCCESS';
export const VERIFY_ERROR = 'VERIFY_ERROR';

export const RESEND_VERIFICATION_EMAIL_REQUEST = 'RESEND_VERIFICATION_EMAIL_REQUEST'
export const RESEND_VERIFICATION_EMAIL_SUCCESS = 'RESEND_VERIFICATION_EMAIL_SUCCESS'
export const RESEND_VERIFICATION_EMAIL_ERROR = 'RESEND_VERIFICATION_EMAIL_ERROR'
export const CLEAR_RESEND_VERIFICATION_INFO = 'CLEAR_RESEND_VERIFICATION_INFO';

export const SYNC_AUTH_INFO = 'SYNC_AUTH_INFO';
export const LOGOUT = 'LOGOUT';

// Profile
export const CHANGE_FIRSTNAME = 'CHANGE_FIRSTNAME';
export const CHANGE_LASTNAME = 'CHANGE_LASTNAME';
export const CHANGE_BIO = 'CHANGE_BIO';
export const EDIT_USER = 'EDIT_USER';

export const GET_USER_REQUEST = 'GET_USER_REQUEST';
export const GET_USER_SUCCESS = 'GET_USER_SUCCESS';
export const GET_USER_ERROR = 'GET_USER_ERROR';

export const SAVE_USER_REQUEST = 'SAVE_USER_REQUEST';
export const SAVE_USER_SUCCESS = 'SAVE_USER_SUCCESS';
export const SAVE_USER_ERROR = 'SAVE_USER_ERROR';

export const TOGGLE_BOOKMARK_REQUEST = 'TOGGLE_BOOKMARK_REQUEST';
export const TOGGLE_BOOKMARK_SUCCESS = 'TOGGLE_BOOKMARK_SUCCESS';
export const TOGGLE_BOOKMARK_ERROR = 'TOGGLE_BOOKMARK_ERROR';

export const UPDATE_USER_PERMISSIONS_REQUEST = 'UPDATE_USER_PERMISSIONS_REQUEST';
export const UPDATE_USER_PERMISSIONS_SUCCESS = 'UPDATE_USER_PERMISSIONS_SUCCESS';
export const UPDATE_USER_PERMISSIONS_ERROR = 'UPDATE_USER_PERMISSIONS_ERROR';

export const LOGOUT_USER_INTEGRATION_REQUEST = 'LOGOUT_USER_INTEGRATION_REQUEST';
export const LOGOUT_USER_INTEGRATION_SUCCESS = 'LOGOUT_USER_INTEGRATION_SUCCESS';
export const LOGOUT_USER_INTEGRATION_ERROR = 'LOGOUT_USER_INTEGRATION_ERROR';

// Display
export const EXPAND_DOCK = 'EXPAND_DOCK';
export const TOGGLE_DOCK = 'TOGGLE_DOCK';

// Screen Recording
export const ADD_SCREEN_RECORDING_CHUNK = 'ADD_SCREEN_RECORDING_CHUNK';
export const START_SCREEN_RECORDING = 'START_SCREEN_RECORDING';
export const END_SCREEN_RECORDING = 'END_SCREEN_RECORDING';

// Cards
export const UPDATE_CARD_WINDOW_POSITION = 'UPDATE_CARD_WINDOW_POSITION';
export const ADJUST_CARDS_DIMENSIONS = 'ADJUST_CARDS_DIMENSIONS';
export const UPDATE_CARD_TAB_ORDER = 'UPDATE_CARD_TAB_ORDER';

export const OPEN_CARD = 'OPEN_CARD';
export const SET_ACTIVE_CARD_INDEX = 'SET_ACTIVE_CARD_INDEX';
export const CLOSE_CARD = 'CLOSE_CARD';
export const CLOSE_ALL_CARDS = 'CLOSE_ALL_CARDS';

export const OPEN_MODAL = 'OPEN_MODAL';
export const CLOSE_MODAL = 'CLOSE_MODAL';

export const OPEN_CARD_MODAL = 'OPEN_CARD_MODAL';
export const CLOSE_CARD_MODAL = 'CLOSE_CARD_MODAL';

export const UPDATE_CARD_QUESTION = 'UPDATE_CARD_QUESTION';
export const UPDATE_CARD_ANSWER_EDITOR = 'UPDATE_CARD_ANSWER_EDITOR';
export const UPDATE_CARD_DESCRIPTION_EDITOR = 'UPDATE_CARD_DESCRIPTION_EDITOR';

export const ENABLE_CARD_EDITOR = 'ENABLE_CARD_EDITOR';
export const DISABLE_CARD_EDITOR = 'DISABLE_CARD_EDITOR';

export const ADJUST_CARD_DESCRIPTION_SECTION_HEIGHT = 'ADJUST_CARD_DESCRIPTION_SECTION_HEIGHT';

export const ADD_CARD_OWNER = 'ADD_CARD_OWNER';
export const REMOVE_CARD_OWNER = 'REMOVE_CARD_OWNER';

export const ADD_CARD_SUBSCRIBER = 'ADD_CARD_SUBSCRIBER';
export const REMOVE_CARD_SUBSCRIBER = 'REMOVE_CARD_SUBSCRIBER';

export const UPDATE_CARD_TAGS = 'UPDATE_CARD_TAGS';
export const REMOVE_CARD_TAG = 'REMOVE_CARD_TAG';

export const UPDATE_CARD_KEYWORDS = 'UPDATE_CARD_KEYWORDS';

export const UPDATE_CARD_VERIFICATION_INTERVAL = 'UPDATE_CARD_VERIFICATION_INTERVAL';

export const UPDATE_CARD_PERMISSIONS = 'UPDATE_CARD_PERMISSIONS';
export const UPDATE_CARD_PERMISSION_GROUPS = 'UPDATE_CARD_PERMISSION_GROUPS';

export const EDIT_CARD = 'EDIT_CARD';
export const CANCEL_EDIT_CARD = 'CANCEL_EDIT_CARD';

export const OPEN_CARD_SIDE_DOCK = 'OPEN_CARD_SIDE_DOCK';
export const CLOSE_CARD_SIDE_DOCK = 'CLOSE_CARD_SIDE_DOCK';

export const UPDATE_OUT_OF_DATE_REASON = 'UPDATE_OUT_OF_DATE_REASON';
export const UPDATE_CARD = 'UPDATE_CARD';

export const UPDATE_CARD_SELECTED_THREAD = 'UPDATE_CARD_SELECTED_THREAD';
export const TOGGLE_CARD_SELECTED_MESSAGE = 'TOGGLE_CARD_SELECTED_MESSAGE';
export const CANCEL_EDIT_CARD_MESSAGES = 'CANCEL_EDIT_CARD_MESSAGES';

export const ADD_CARD_ATTACHMENT_REQUEST = 'ADD_CARD_ATTACHMENT_REQUEST';
export const ADD_CARD_ATTACHMENT_SUCCESS = 'ADD_CARD_ATTACHMENT_SUCCESS';
export const ADD_CARD_ATTACHMENT_ERROR = 'ADD_CARD_ATTACHMENT_ERROR';

export const REMOVE_CARD_ATTACHMENT = 'REMOVE_CARD_ATTACHMENT';
export const UPDATE_CARD_ATTACHMENT_NAME = 'UPDATE_CARD_ATTACHMENT_NAME';

export const GET_CARD_REQUEST = 'GET_CARD_REQUEST';
export const GET_CARD_SUCCESS = 'GET_CARD_SUCCESS';
export const GET_CARD_ERROR = 'GET_CARD_ERROR';

export const CREATE_CARD_REQUEST = 'CREATE_CARD_REQUEST';
export const CREATE_CARD_SUCCESS = 'CREATE_CARD_SUCCESS';
export const CREATE_CARD_ERROR = 'CREATE_CARD_ERROR';

export const UPDATE_CARD_REQUEST = 'UPDATE_CARD_REQUEST';
export const UPDATE_CARD_SUCCESS = 'UPDATE_CARD_SUCCESS';
export const UPDATE_CARD_ERROR = 'UPDATE_CARD_ERROR';

export const DELETE_CARD_REQUEST = 'DELETE_CARD_REQUEST';
export const DELETE_CARD_SUCCESS = 'DELETE_CARD_SUCCESS';
export const DELETE_CARD_ERROR = 'DELETE_CARD_ERROR';

export const TOGGLE_UPVOTE_REQUEST = 'TOGGLE_UPVOTE_REQUEST';
export const TOGGLE_UPVOTE_SUCCESS = 'TOGGLE_UPVOTE_SUCCESS';
export const TOGGLE_UPVOTE_ERROR = 'TOGGLE_UPVOTE_ERROR';

export const MARK_UP_TO_DATE_REQUEST = 'MARK_UP_TO_DATE_REQUEST';
export const MARK_UP_TO_DATE_SUCCESS = 'MARK_UP_TO_DATE_SUCCESS';
export const MARK_UP_TO_DATE_ERROR = 'MARK_UP_TO_DATE_ERROR';

export const MARK_OUT_OF_DATE_REQUEST = 'MARK_OUT_OF_DATE_REQUEST';
export const MARK_OUT_OF_DATE_SUCCESS = 'MARK_OUT_OF_DATE_SUCCESS';
export const MARK_OUT_OF_DATE_ERROR = 'MARK_OUT_OF_DATE_ERROR';

export const APPROVE_CARD_REQUEST = 'APPROVE_CARD_REQUEST';
export const APPROVE_CARD_SUCCESS = 'APPROVE_CARD_SUCCESS';
export const APPROVE_CARD_ERROR = 'APPROVE_CARD_ERROR';

export const ADD_BOOKMARK_REQUEST = 'ADD_BOOKMARK_REQUEST';
export const ADD_BOOKMARK_SUCCESS = 'ADD_BOOKMARK_SUCCESS';
export const ADD_BOOKMARK_ERROR = 'ADD_BOOKMARK_ERROR';

export const REMOVE_BOOKMARK_REQUEST = 'REMOVE_BOOKMARK_REQUEST';
export const REMOVE_BOOKMARK_SUCCESS = 'REMOVE_BOOKMARK_SUCCESS';
export const REMOVE_BOOKMARK_ERROR = 'REMOVE_BOOKMARK_ERROR';

export const GET_SLACK_THREAD_REQUEST = 'GET_SLACK_THREAD_REQUEST';
export const GET_SLACK_THREAD_SUCCESS = 'GET_SLACK_THREAD_SUCCESS';
export const GET_SLACK_THREAD_ERROR = 'GET_SLACK_THREAD_ERROR';

// Ask
export const UPDATE_ASK_SEARCH_TEXT = 'UPDATE_ASK_SEARCH_TEXT';
export const TOGGLE_ASK_FEEDBACK_INPUT = 'TOGGLE_ASK_FEEDBACK_INPUT';
export const UPDATE_ASK_FEEDBACK = 'UPDATE_ASK_FEEDBACK';

export const CHANGE_ASK_INTEGRATION = 'CHANGE_ASK_INTEGRATION';
export const UPDATE_ASK_QUESTION_TITLE = 'UPDATE_ASK_QUESTION_TITLE';
export const UPDATE_ASK_QUESTION_DESCRIPTION = 'UPDATE_ASK_QUESTION_DESCRIPTION';

export const ADD_ASK_RECIPIENT = 'ADD_ASK_RECIPIENT';
export const REMOVE_ASK_RECIPIENT = 'REMOVE_ASK_RECIPIENT';
export const UPDATE_ASK_RECIPIENT = 'UPDATE_ASK_RECIPIENT';

export const ADD_ASK_ATTACHMENT_REQUEST = 'ADD_ASK_ATTACHMENT_REQUEST';
export const ADD_ASK_ATTACHMENT_SUCCESS = 'ADD_ASK_ATTACHMENT_SUCCESS';
export const ADD_ASK_ATTACHMENT_ERROR = 'ADD_ASK_ATTACHMENT_ERROR';

export const REMOVE_ASK_ATTACHMENT_REQUEST = 'REMOVE_ASK_ATTACHMENT_REQUEST';
export const REMOVE_ASK_ATTACHMENT_SUCCESS = 'REMOVE_ASK_ATTACHMENT_SUCCESS';
export const REMOVE_ASK_ATTACHMENT_ERROR = 'REMOVE_ASK_ATTACHMENT_ERROR';

export const UPDATE_ASK_ATTACHMENT_NAME = 'UPDATE_ASK_ATTACHMENT_NAME';

export const GET_SLACK_CONVERSATIONS_REQUEST = 'GET_SLACK_CONVERSATIONS_REQUEST';
export const GET_SLACK_CONVERSATIONS_SUCCESS = 'GET_SLACK_CONVERSATIONS_SUCCESS';
export const GET_SLACK_CONVERSATIONS_ERROR = 'GET_SLACK_CONVERSATIONS_ERROR';

export const ASK_QUESTION_REQUEST = 'ASK_QUESTION_REQUEST';
export const ASK_QUESTION_SUCCESS = 'ASK_QUESTION_SUCCESS';
export const ASK_QUESTION_ERROR = 'ASK_QUESTION_ERROR';
export const CLEAR_ASK_QUESTION_INFO = 'CLEAR_ASK_QUESTION_INFO';

export const SUBMIT_FEEDBACK_REQUEST = 'SUBMIT_FEEDBACK_REQUEST';
export const SUBMIT_FEEDBACK_SUCCESS = 'SUBMIT_FEEDBACK_SUCCESS';
export const SUBMIT_FEEDBACK_ERROR = 'SUBMIT_FEEDBACK_ERROR';

// Create
export const SHOW_CREATE_DESCRIPTION_EDITOR = 'SHOW_CREATE_DESCRIPTION_EDITOR';
export const CLEAR_CREATE_PANEL = 'CLEAR_CREATE_PANEL';
export const UPDATE_CREATE_QUESTION = 'UPDATE_CREATE_QUESTION';
export const UPDATE_CREATE_ANSWER_EDITOR = 'UPDATE_CREATE_ANSWER_EDITOR';
export const UPDATE_CREATE_DESCRIPTION_EDITOR = 'UPDATE_CREATE_DESCRIPTION_EDITOR';

export const ADD_CREATE_ATTACHMENT_REQUEST = 'ADD_CREATE_ATTACHMENT_REQUEST';
export const ADD_CREATE_ATTACHMENT_SUCCESS = 'ADD_CREATE_ATTACHMENT_SUCCESS';
export const ADD_CREATE_ATTACHMENT_ERROR = 'ADD_CREATE_ATTACHMENT_ERROR';

export const REMOVE_CREATE_ATTACHMENT_REQUEST = 'REMOVE_CREATE_ATTACHMENT_REQUEST';
export const REMOVE_CREATE_ATTACHMENT_SUCCESS = 'REMOVE_CREATE_ATTACHMENT_SUCCESS';
export const REMOVE_CREATE_ATTACHMENT_ERROR = 'REMOVE_CREATE_ATTACHMENT_ERROR';

export const UPDATE_CREATE_ATTACHMENT_NAME = 'UPDATE_CREATE_ATTACHMENT_NAME';


// Navigate
export const UPDATE_NAVIGATE_SEARCH_TEXT = 'UPDATE_NAVIGATE_SEARCH_TEXT';
export const UPDATE_NAVIGATE_TAB = 'UPDATE_NAVIGATE_TAB';
export const UPDATE_FILTER_TAGS = 'UPDATE_FILTER_TAGS';
export const REMOVE_FILTER_TAG = 'REMOVE_FILTER_TAG';

export const DELETE_NAVIGATE_CARD_REQUEST = 'DELETE_NAVIGATE_CARD_REQUEST';
export const DELETE_NAVIGATE_CARD_SUCCESS = 'DELETE_NAVIGATE_CARD_SUCCESS';
export const DELETE_NAVIGATE_CARD_ERROR = 'DELETE_NAVIGATE_CARD_ERROR';

// Tasks
export const UPDATE_TASKS_TAB = 'UPDATE_TASKS_TAB';
export const UPDATE_TASKS_OPEN_SECTION = 'UPDATE_TASKS_OPEN_SECTION';

export const GET_TASKS_REQUEST = 'GET_TASKS_REQUEST';
export const GET_TASKS_SUCCESS = 'GET_TASKS_SUCCESS';
export const GET_TASKS_ERROR = 'GET_TASKS_ERROR';

export const MARK_UP_TO_DATE_FROM_TASKS_REQUEST = 'MARK_UP_TO_DATE_FROM_TASKS_REQUEST';
export const MARK_UP_TO_DATE_FROM_TASKS_SUCCESS = 'MARK_UP_TO_DATE_FROM_TASKS_SUCCESS';
export const MARK_UP_TO_DATE_FROM_TASKS_ERROR = 'MARK_UP_TO_DATE_FROM_TASKS_ERROR';

export const APPROVE_CARD_FROM_TASKS_REQUEST = 'APPROVE_CARD_FROM_TASKS_REQUEST';
export const APPROVE_CARD_FROM_TASKS_SUCCESS = 'APPROVE_CARD_FROM_TASKS_SUCCESS';
export const APPROVE_CARD_FROM_TASKS_ERROR = 'APPROVE_CARD_FROM_TASKS_ERROR';

export const DISMISS_TASK_REQUEST = 'DISMISS_TASK_REQUEST';
export const DISMISS_TASK_SUCCESS = 'DISMISS_TASK_SUCCESS';
export const DISMISS_TASK_ERROR = 'DISMISS_TASK_ERROR';

export const REMOVE_TASK = 'REMOVE_TASK';

export const SYNC_TASKS = 'SYNC_TASKS';

// Search
export const SEARCH_CARDS_REQUEST = 'SEARCH_CARDS_REQUEST';
export const SEARCH_CARDS_SUCCESS = 'SEARCH_CARDS_SUCCESS';
export const SEARCH_CARDS_ERROR = 'SEARCH_CARDS_ERROR';

export const CLEAR_SEARCH_CARDS = 'CLEAR_SEARCH_CARDS';

export const ADD_SEARCH_CARD = 'ADD_SEARCH_CARD';
export const UPDATE_SEARCH_CARD = 'UPDATE_SEARCH_CARD';
export const REMOVE_SEARCH_CARD = 'REMOVE_SEARCH_CARD';

export const SEARCH_TAGS_REQUEST = 'SEARCH_TAGS_REQUEST';
export const SEARCH_TAGS_SUCCESS = 'SEARCH_TAGS_SUCCESS';
export const SEARCH_TAGS_ERROR = 'SEARCH_TAGS_ERROR';

export const SEARCH_USERS_REQUEST = 'SEARCH_USERS_REQUEST';
export const SEARCH_USERS_SUCCESS = 'SEARCH_USERS_SUCCESS';
export const SEARCH_USERS_ERROR = 'SEARCH_USERS_ERROR';

export const SEARCH_PERMISSION_GROUPS_REQUEST = 'SEARCH_PERMISSION_GROUPS_REQUEST';
export const SEARCH_PERMISSION_GROUPS_SUCCESS = 'SEARCH_PERMISSION_GROUPS_SUCCESS';
export const SEARCH_PERMISSION_GROUPS_ERROR = 'SEARCH_PERMISSION_GROUPS_ERROR';

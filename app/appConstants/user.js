import { INTEGRATIONS as ALL_INTEGRATIONS } from './general';

export const ROLE = {
  ADMIN: 'Admin',
  EDITOR: 'Editor',
  VIEWER: 'Viewer'
};

export const ROLE_LIST = [ROLE.ADMIN, ROLE.EDITOR, ROLE.VIEWER];

export const STATUS = {
  INVITED: 'Invited',
  ACTIVE: 'Active'
};

export const BADGE = {
  BRONZE: 'Bronze',
  SILVER: 'Silver',
  GOLD: 'Gold',
  PLATINUM: 'Platinum'
};

export const PERFORMANCE = {
  SEARCH_OPEN: 'searchOpen',
  MARK_HELPFUL: 'markHelpful',
  ADD_INTEGRATIONS: 'addIntegrations',
  CREATE_CARD: 'createCard',

  ADD_PROFILE_PICTURE: 'addProfilePicture',
  VERIFY_EXTERNAL: 'verifyExternal',

  ALL_UP_TO_DATE: 'allUpToDate',
  ADD_SUBSCRIBER: 'addSubscriber',
  CREATE_CARD_RECENT: 'createCardRecent',

  OPEN_EXTERNAL_DOC: 'openExternalDoc',
  USE_SLACK_FIND: 'useSlackFind'
};

export const AUDIT = {
  TYPE: {
    SEARCH: 'search',
    VIEW_CARD: 'viewCard',
    ACTION: 'userAction',
    MARK_CARD_UPTODATE: 'markCardUpToDate',
    MARK_CARD_OUTOFDATE: 'markCardOutOfDate',
    UPDATE_CARD: 'updateCard',
    CREATE_CARD: 'createCard',
    CONTEXT_MENU_SEARCH: 'contextMenuSearch',
    OPEN_EXTERNAL_DOC: 'openExternalDoc',
    OPEN_EXTENSION: 'openExtension',
    SIGN_UP: 'signUp'
  },
  SOURCE: {
    FINDER: 'finder',
    DOCK: 'dock',
    EXTERNAL: 'external',
    SLACK: 'slack',
    SEGMENT: 'segment',
    DASHBOARD: 'dashboard'
  }
};

export const SEEN_FEATURES = {
  OWNERS: 'owners',
  UPDATE_INTERVAL: 'updateInterval',
  SUBSCRIBERS: 'subscribers',
  VERIFY_EXTERNAL: 'verifyExternal',
  FINDER: 'finder',
  TASKS: 'tasks'
};

export const INTEGRATIONS = [
  ALL_INTEGRATIONS.CONFLUENCE,
  ALL_INTEGRATIONS.GOOGLE,
  ALL_INTEGRATIONS.JIRA,
  ALL_INTEGRATIONS.SLACK,
  ALL_INTEGRATIONS.ZENDESK
];

export const ONBOARDING = {
  COMPLETE: -1,
  TYPE: {
    ADMIN: 'admin',
    MEMBER: 'member'
  }
};

export default {
  ROLE,
  ROLE_LIST,
  STATUS,
  BADGE,
  AUDIT,
  PERFORMANCE,
  SEEN_FEATURES,
  INTEGRATIONS,
  ONBOARDING
};

import { INTEGRATIONS } from './general';

export const SETTING_SECTION_TYPE = {
  INTEGRATIONS: 'INTEGRATIONS',
  AUTOFIND: 'AUTOFIND',
  NOTIFICATIONS: 'NOTIFICATIONS',
  EXTERNAL_VERIFICATION: 'EXTERNAL_VERIFICATION',
  SEARCH_BAR: 'SEARCH_BAR'
};

export const USER_ROLE = {
  ADMIN: 'Admin',
  MEMBER: 'Member'
};

export const USER_BADGE = {
  BRONZE: 'Bronze',
  SILVER: 'Silver',
  GOLD: 'Gold',
  PLATINUM: 'Platinum'
};

export const USER_PERFORMANCE = {
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
    USER_ACTION: 'userAction',
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

export const USER_INTEGRATIONS = [
  INTEGRATIONS.CONFLUENCE,
  INTEGRATIONS.GOOGLE,
  INTEGRATIONS.JIRA,
  INTEGRATIONS.SLACK,
  INTEGRATIONS.ZENDESK
];

export const ONBOARDING_COMPLETE = -1;

export default {
  SETTING_SECTION_TYPE,
  USER_ROLE,
  USER_BADGE,
  AUDIT,
  USER_PERFORMANCE,
  SEEN_FEATURES,
  USER_INTEGRATIONS,
  ONBOARDING_COMPLETE
};

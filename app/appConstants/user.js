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
  PERFORMANCE,
  SEEN_FEATURES,
  INTEGRATIONS,
  ONBOARDING
};

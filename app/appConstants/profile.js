export const SETTING_SECTION_TYPE = {
  INTEGRATIONS: 'INTEGRATIONS',
  AUTOFIND: 'AUTOFIND',
  NOTIFICATIONS: 'NOTIFICATIONS',
  EXTERNAL_VERIFICATION: 'EXTERNAL_VERIFICATION'
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

export const AUDIT_TYPE = {
  SEARCH: 'search',
  VIEW_CARD: 'viewCard',
  USER_ACTION: 'userAction',
  MARK_CARD_UPTODATE: 'markCardUpToDate',
  MARK_CARD_OUTOFDATE: 'markCardOutOfDate',
  UPDATE_CARD: 'updateCard',
  CREATE_CARD: 'createCard',
  CREATE_CARD_EXTENSION: 'createCardExtension',
  CONTEXT_MENU_SEARCH: 'contextMenuSearch',
  OPEN_EXTERNAL_DOC: 'openExternalDoc',
  SLACK_FIND_COMMAND: 'slackFindCommand'
};

export const ONBOARDING_COMPLETE = -1;

export default {
  SETTING_SECTION_TYPE,
  USER_ROLE,
  USER_BADGE,
  USER_PERFORMANCE,
  AUDIT_TYPE,
  ONBOARDING_COMPLETE
};

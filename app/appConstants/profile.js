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

export const ONBOARDING_SECTION = {
  CREATE_CARDS: 'createCards',
  INTEGRATIONS: 'integrations'
};

export default {
  SETTING_SECTION_TYPE,
  USER_ROLE,
  USER_BADGE,
  AUDIT_TYPE,
  ONBOARDING_COMPLETE,
  ONBOARDING_SECTION
};

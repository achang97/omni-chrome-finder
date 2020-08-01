const AUDIT = {
  TYPE: {
    SEARCH: 'search',
    VIEW_CARD: 'viewCard',
    VIEW_FINDER_NODE: 'viewFinderNode',
    USER_ACTION: 'userAction',
    MARK_CARD_UPTODATE: 'markCardUpToDate',
    MARK_CARD_OUTOFDATE: 'markCardOutOfDate',
    UPDATE_CARD: 'updateCard',
    CREATE_CARD: 'createCard',
    OPEN_EXTERNAL_DOC: 'openExternalDoc',
    OPEN_EXTENSION: 'openExtension',
    POST_ANSWER: 'postAnswer',
    RESOLVE_NOTIFICATION: 'resolveNotification',
    CLICK: 'click'
  },
  CLICK: {
    CREATE_CARD: 'createCard',
    CONTEXT_MENU_SEARCH: 'contextMenuSearch'
  },
  SOURCE: {
    FINDER: 'finder',
    DOCK: 'dock',
    EXTERNAL: 'external',
    SLACK: 'slack',
    SEGMENT: 'segment',
    DASHBOARD: 'dashboard',
    AUTOFIND: 'autofind'
  }
};

module.exports = AUDIT;

const AUDIT = {
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
    SIGN_UP: 'signUp',
    CLICK: 'click'
  },
  CLICK: {
    CREATE_CARD: 'createCard'
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

export default AUDIT;

export const MAIN_STATE_ID = 'MAIN';

export const TAB_INDEX = -1;
export const TAB = null;

export const ROOT = {
  ID: 'root',
  NAME: 'Home'
};

export const PATH_TYPE = {
  NODE: 'NODE',
  SEGMENT: 'SEGMENT'
};

export const NODE_TYPE = {
  FOLDER: 'folder'
};

export const FINDER_TYPE = {
  CARD: 'card',
  NODE: 'node'
};

export const SEGMENT_TYPE = {
  MY_CARDS: 'MY_CARDS',
  BOOKMARKED: 'BOOKMARKED'
};

export const SEARCH_TYPE = {
  ALL_FOLDERS: 'ALL_FOLDERS',
  CURRENT_FOLDER: 'CURRENT_FOLDER'
};

export const MODAL_TYPE = {
  CREATE_FOLDER: 'CREATE_FOLDER',
  EDIT_FOLDER: 'EDIT_FOLDER',
  CONFIRM_DELETE: 'CONFIRM_DELETE',
  ERROR_MOVE: 'ERROR_MOVE',
  ERROR_GET: 'ERROR_GET'
};

export default {
  MAIN_STATE_ID,
  TAB_INDEX,
  TAB,
  ROOT,
  PATH_TYPE,
  NODE_TYPE,
  FINDER_TYPE,
  SEGMENT_TYPE,
  SEARCH_TYPE,
  MODAL_TYPE
};

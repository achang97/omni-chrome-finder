import * as types from './actionTypes';

export function goBackFinder() {
  return { type: types.GO_BACK_FINDER, payload: {} };
}

export function pushFinderPath(path) {
  return { type: types.PUSH_FINDER_PATH, payload: { path } };
}

export function updateFinderSearchText(text) {
  return { type: types.UPDATE_FINDER_SEARCH_TEXT, payload: { text } };
}

export function selectFinderNodeIndex(index) {
  return { type: types.SELECT_FINDER_NODE_INDEX, payload: { index } };
}

export function toggleSelectedFinderNodeIndex(index) {
  return { type: types.TOGGLE_SELECTED_FINDER_NODE_INDEX, payload: { index } };
}

export function requestCreateFinderFolder() {
  return { type: types.CREATE_FINDER_FOLDER_REQUEST, payload: {} };
}

export function handleCreateFinderFolderSuccess() {
  return { type: types.CREATE_FINDER_FOLDER_SUCCESS, payload: {} };
}

export function handleCreateFinderFolderError(error) {
  return { type: types.GET_TEMPLATES_ERROR, payload: { error } };
}

export function requestMoveFinderContent() {
  return { type: types.MOVE_FINDER_CONTENT_REQUEST, payload: {} };
}

export function handleMoveFinderContentSuccess() {
  return { type: types.MOVE_FINDER_CONTENT_SUCCESS, payload: {} };
}

export function handleMoveFinderContentError(error) {
  return { type: types.MOVE_FINDER_CONTENT_ERROR, payload: { error } };
}

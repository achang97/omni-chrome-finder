import * as types from './actionTypes';

export function openFinder() {
  return { type: types.OPEN_FINDER, payload: {} };
}

export function goBackFinder() {
  return { type: types.GO_BACK_FINDER, payload: {} };
}

export function pushFinderNode(nodeId) {
  return { type: types.PUSH_FINDER_NODE, payload: { nodeId } };
}

export function pushFinderSegment(segmentId, segmentName) {
  return { type: types.PUSH_FINDER_SEGMENT, payload: { segmentId, segmentName } };
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

export function requestGetFinderNode(nodeId) {
  return { type: types.GET_FINDER_NODE_REQUEST, payload: { nodeId } };
}

export function handleGetFinderNodeSuccess(node) {
  return { type: types.GET_FINDER_NODE_SUCCESS, payload: { node } };
}

export function handleGetFinderNodeError(error) {
  return { type: types.GET_FINDER_NODE_ERROR, payload: { error } };
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

export function requestMoveFinderNode() {
  return { type: types.MOVE_FINDER_NODE_REQUEST, payload: {} };
}

export function handleMoveFinderNodeSuccess() {
  return { type: types.MOVE_FINDER_NODE_SUCCESS, payload: {} };
}

export function handleMoveFinderNodeError(error) {
  return { type: types.MOVE_FINDER_NODE_ERROR, payload: { error } };
}

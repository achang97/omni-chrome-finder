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

export function openFinderModal(modalType) {
  return { type: types.OPEN_FINDER_MODAL, payload: { modalType } };
}

export function closeFinderModal(modalType) {
  return { type: types.CLOSE_FINDER_MODAL, payload: { modalType } };
}

export function updateFinderFolderName(name) {
  return { type: types.UPDATE_FINDER_FOLDER_NAME, payload: { name } };
}

export function updateFinderFolderPermissions(permissions) {
  return { type: types.UPDATE_FINDER_FOLDER_PERMISSIONS, payload: { permissions } };
}

export function updateFinderFolderPermissionGroups(permissionGroups) {
  return { type: types.UPDATE_FINDER_FOLDER_PERMISSION_GROUPS, payload: { permissionGroups } };
}

export function updateSelectedFinderIndices(indices) {
  return { type: types.UPDATE_SELECTED_FINDER_INDICES, payload: { indices } };
}

export function requestGetFinderNode() {
  return { type: types.GET_FINDER_NODE_REQUEST, payload: {} };
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
  return { type: types.CREATE_FINDER_FOLDER_ERROR, payload: { error } };
}

export function requestUpdateFinderFolder() {
  return { type: types.UPDATE_FINDER_FOLDER_REQUEST, payload: {} };
}

export function handleUpdateFinderFolderSuccess() {
  return { type: types.UPDATE_FINDER_FOLDER_SUCCESS, payload: {} };
}

export function handleUpdateFinderFolderError(error) {
  return { type: types.UPDATE_FINDER_FOLDER_ERROR, payload: { error } };
}

export function requestDeleteFinderNodes() {
  return { type: types.DELETE_FINDER_NODES_REQUEST, payload: {} };
}

export function handleDeleteFinderNodesSuccess() {
  return { type: types.DELETE_FINDER_NODES_SUCCESS, payload: {} };
}

export function handleDeleteFinderNodesError(error) {
  return { type: types.DELETE_FINDER_NODES_ERROR, payload: { error } };
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

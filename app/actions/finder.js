import * as types from './actionTypes';

export function openFinder() {
  return { type: types.OPEN_FINDER, payload: {} };
}

export function initFinder(finderId, nodeId) {
  return { type: types.INIT_FINDER, payload: { finderId, nodeId } };
}

export function closeFinder(finderId) {
  return { type: types.CLOSE_FINDER, payload: { finderId } };
}

export function goBackFinder(finderId) {
  return { type: types.GO_BACK_FINDER, payload: { finderId } };
}

export function pushFinderNode(finderId, nodeId) {
  return { type: types.PUSH_FINDER_NODE, payload: { finderId, nodeId } };
}

export function pushFinderSegment(finderId, segmentId, segmentName) {
  return { type: types.PUSH_FINDER_SEGMENT, payload: { finderId, segmentId, segmentName } };
}

export function updateFinderSearchText(finderId, text) {
  return { type: types.UPDATE_FINDER_SEARCH_TEXT, payload: { finderId, text } };
}

export function openFinderModal(finderId, modalType) {
  return { type: types.OPEN_FINDER_MODAL, payload: { finderId, modalType } };
}

export function closeFinderModal(finderId, modalType) {
  return { type: types.CLOSE_FINDER_MODAL, payload: { finderId, modalType } };
}

export function updateFinderFolderName(finderId, name) {
  return { type: types.UPDATE_FINDER_FOLDER_NAME, payload: { finderId, name } };
}

export function updateFinderFolderPermissions(finderId, permissions) {
  return { type: types.UPDATE_FINDER_FOLDER_PERMISSIONS, payload: { finderId, permissions } };
}

export function updateFinderFolderPermissionGroups(finderId, permissionGroups) {
  return {
    type: types.UPDATE_FINDER_FOLDER_PERMISSION_GROUPS,
    payload: { finderId, permissionGroups }
  };
}

export function updateSelectedFinderNodes(finderId, nodes) {
  return { type: types.UPDATE_SELECTED_FINDER_NODES, payload: { finderId, nodes } };
}

export function updateDraggingFinderNode(finderId, node) {
  return { type: types.UPDATE_DRAGGING_FINDER_NODE, payload: { finderId, node } };
}

export function startMoveFinderNodes(finderId) {
  return { type: types.START_MOVE_FINDER_NODES, payload: { finderId } };
}

export function cancelMoveFinderNodes(finderId) {
  return { type: types.CANCEL_MOVE_FINDER_NODES, payload: { finderId } };
}

export function requestGetFinderNode(finderId) {
  return { type: types.GET_FINDER_NODE_REQUEST, payload: { finderId } };
}

export function handleGetFinderNodeSuccess(finderId, node) {
  return { type: types.GET_FINDER_NODE_SUCCESS, payload: { finderId, node } };
}

export function handleGetFinderNodeError(finderId, error) {
  return { type: types.GET_FINDER_NODE_ERROR, payload: { finderId, error } };
}

export function requestCreateFinderFolder(finderId) {
  return { type: types.CREATE_FINDER_FOLDER_REQUEST, payload: { finderId } };
}

export function handleCreateFinderFolderSuccess(finderId) {
  return { type: types.CREATE_FINDER_FOLDER_SUCCESS, payload: { finderId } };
}

export function handleCreateFinderFolderError(finderId, error) {
  return { type: types.CREATE_FINDER_FOLDER_ERROR, payload: { finderId, error } };
}

export function requestUpdateFinderFolder(finderId) {
  return { type: types.UPDATE_FINDER_FOLDER_REQUEST, payload: { finderId } };
}

export function handleUpdateFinderFolderSuccess(finderId, folder) {
  return { type: types.UPDATE_FINDER_FOLDER_SUCCESS, payload: { finderId, folder } };
}

export function handleUpdateFinderFolderError(finderId, error) {
  return { type: types.UPDATE_FINDER_FOLDER_ERROR, payload: { finderId, error } };
}

export function requestDeleteFinderNodes(finderId) {
  return { type: types.DELETE_FINDER_NODES_REQUEST, payload: { finderId } };
}

export function handleDeleteFinderNodesSuccess(finderId, nodeIds, cardIds) {
  return { type: types.DELETE_FINDER_NODES_SUCCESS, payload: { finderId, nodeIds, cardIds } };
}

export function handleDeleteFinderNodesError(finderId, error) {
  return { type: types.DELETE_FINDER_NODES_ERROR, payload: { finderId, error } };
}

export function requestMoveFinderNodes(finderId, nodes, destinationId) {
  return { type: types.MOVE_FINDER_NODES_REQUEST, payload: { finderId, nodes, destinationId } };
}

export function handleMoveFinderNodesSuccess(finderId) {
  return { type: types.MOVE_FINDER_NODES_SUCCESS, payload: { finderId } };
}

export function handleMoveFinderNodesError(finderId, error) {
  return { type: types.MOVE_FINDER_NODES_ERROR, payload: { finderId, error } };
}

export function updateFinderNode(node) {
  return { type: types.UPDATE_FINDER_NODE, payload: { node } };
}

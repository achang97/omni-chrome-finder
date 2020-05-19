import { take, call, fork, put, select, delay } from 'redux-saga/effects';
import _ from 'lodash';
import { doGet, doPost, doDelete, getErrorMessage } from 'utils/request';
import {
  GET_FINDER_NODE_REQUEST,
  CREATE_FINDER_FOLDER_REQUEST,
  UPDATE_FINDER_FOLDER_REQUEST,
  DELETE_FINDER_NODES_REQUEST,
  BULK_DELETE_FINDER_CARDS_REQUEST,
  MOVE_FINDER_NODES_REQUEST
} from 'actions/actionTypes';
import {
  requestGetFinderNode,
  handleGetFinderNodeSuccess,
  handleGetFinderNodeError,
  handleCreateFinderFolderSuccess,
  handleCreateFinderFolderError,
  handleUpdateFinderFolderSuccess,
  handleUpdateFinderFolderError,
  handleDeleteFinderNodesSuccess,
  handleDeleteFinderNodesError,
  handleBulkDeleteFinderCardsSuccess,
  handleBulkDeleteFinderCardsError,
  handleMoveFinderNodesSuccess,
  handleMoveFinderNodesError
} from 'actions/finder';
import { MOCK_DIRECTORY_LOOKUP } from 'appConstants/finder';

export default function* watchFinderRequests() {
  while (true) {
    const action = yield take([
      GET_FINDER_NODE_REQUEST,
      CREATE_FINDER_FOLDER_REQUEST,
      UPDATE_FINDER_FOLDER_REQUEST,
      DELETE_FINDER_NODES_REQUEST,
      BULK_DELETE_FINDER_CARDS_REQUEST,
      MOVE_FINDER_NODES_REQUEST
    ]);

    const { type, payload } = action;
    switch (type) {
      case GET_FINDER_NODE_REQUEST: {
        yield fork(getNode, payload);
        break;
      }
      case CREATE_FINDER_FOLDER_REQUEST: {
        yield fork(createFolder, payload);
        break;
      }
      case UPDATE_FINDER_FOLDER_REQUEST: {
        yield fork(updateFolder, payload);
        break;
      }
      case DELETE_FINDER_NODES_REQUEST: {
        yield fork(deleteNodes, payload);
        break;
      }
      case BULK_DELETE_FINDER_CARDS_REQUEST: {
        yield fork(bulkDeleteCards, payload);
        break;
      }
      case MOVE_FINDER_NODES_REQUEST: {
        yield fork(moveNode, payload);
        break;
      }
      default: {
        break;
      }
    }
  }
}

function* getParentNodeId(finderId) {
  const finderHistory = yield select((state) => state.finder[finderId].history);
  const parentNode = _.last(finderHistory);
  return parentNode._id;
}

function* getNode({ finderId }) {
  try {
    const nodeId = yield call(getParentNodeId, finderId);
    // TODO: make a request to get this information
    const node = MOCK_DIRECTORY_LOOKUP[nodeId];
    yield delay(1000);
    yield put(handleGetFinderNodeSuccess(finderId, node));
  } catch (error) {
    yield put(handleGetFinderNodeError(finderId, getErrorMessage(error)));
  }
}

function* createFolder({ finderId }) {
  try {
    const { name, permissions, permissionGroups } = yield select((state) => state.finder[finderId].edits.folder);

    // TODO: make a request to create folder
    yield delay(1000);
    const parentNodeId = yield call(getParentNodeId, finderId);
    const newFolder = {
      _id: 'some new folder',
      name,
      children: [],
      parent: MOCK_DIRECTORY_LOOKUP[parentNodeId],
      card: null
    };
    MOCK_DIRECTORY_LOOKUP[parentNodeId].children.push(newFolder);
    MOCK_DIRECTORY_LOOKUP[newFolder._id] = newFolder;

    yield put(requestGetFinderNode(finderId));
    yield put(handleCreateFinderFolderSuccess(finderId));
  } catch (error) {
    yield put(handleCreateFinderFolderError(finderId, getErrorMessage(error)));
  }
}

function* updateFolder({ finderId }) {
  try {
    const {
      selectedNodeIds,
      edits: {
        folder: { name, permissions, permissionGroups }
      }
    } = yield select((state) => state.finder[finderId]);

    // TODO: make a request to create folder
    yield delay(1000);
    const selectedNodeId = selectedNodeIds[0];

    MOCK_DIRECTORY_LOOKUP[selectedNodeId].name = name;

    yield put(requestGetFinderNode(finderId));
    yield put(handleUpdateFinderFolderSuccess(finderId));
  } catch (error) {
    yield put(handleUpdateFinderFolderError(finderId, getErrorMessage(error)));
  }
}

function* deleteNodes({ finderId }) {
  try {
    const selectedNodeIds = yield select((state) => state.finder[finderId].selectedNodeIds);

    // TODO: make a request to delete folder
    yield delay(1000);
    selectedNodeIds.forEach((nodeId) => {
      const { parent, children } = MOCK_DIRECTORY_LOOKUP[nodeId];
      if (parent) {
        parent.children = parent.children.filter(({ _id }) => _id !== nodeId);
      }

      if (children) {
        children.forEach(({ _id }) => {
          delete MOCK_DIRECTORY_LOOKUP[_id];
        });
      }

      delete MOCK_DIRECTORY_LOOKUP[nodeId];
    });

    yield put(requestGetFinderNode(finderId));
    yield put(handleDeleteFinderNodesSuccess(finderId));
  } catch (error) {
    yield put(handleDeleteFinderNodesError(finderId, getErrorMessage(error)));
  }
}

function* bulkDeleteCards({ finderId }) {
  try {
    const selectedNodeIds = yield select((state) => state.finder[finderId].selectedNodeIds);
    yield call(doDelete, '/cards/bulk', selectedNodeIds);
    yield put(handleBulkDeleteFinderCardsSuccess(finderId, selectedNodeIds));
  } catch (error) {
    yield put(handleBulkDeleteFinderCardsError(finderId, getErrorMessage(error)));
  }
}

function* moveNode({ finderId, destinationId }) {
  try {
    const moveNodeIds = yield select((state) => state.finder[finderId].moveNodeIds);

    // TODO: make a request to move nodes
    // TODO: have better checks on history when moving to "drop" node
    yield delay(1000);
    moveNodeIds.forEach((nodeId) => {
      const { parent } = MOCK_DIRECTORY_LOOKUP[nodeId];
      if (parent) {
        parent.children = parent.children.filter(({ _id }) => _id !== nodeId);
      }

      MOCK_DIRECTORY_LOOKUP[nodeId].parent = MOCK_DIRECTORY_LOOKUP[destinationId];
      MOCK_DIRECTORY_LOOKUP[destinationId].children.push(MOCK_DIRECTORY_LOOKUP[nodeId]);
    });

    yield put(requestGetFinderNode(finderId));
    yield put(handleMoveFinderNodesSuccess(finderId));
  } catch (error) {
    yield put(handleMoveFinderNodesError(finderId, getErrorMessage(error)));
  }
}

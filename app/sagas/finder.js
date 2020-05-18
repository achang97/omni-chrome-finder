import { take, call, all, fork, put, select, delay } from 'redux-saga/effects';
import _ from 'lodash';
import { doGet, doPost, doDelete, getErrorMessage } from 'utils/request';
import {
  GET_FINDER_NODE_REQUEST,
  CREATE_FINDER_FOLDER_REQUEST,
  UPDATE_FINDER_FOLDER_REQUEST,
  DELETE_FINDER_NODES_REQUEST,
  BULK_DELETE_FINDER_CARDS_REQUEST,
  MOVE_FINDER_NODES_REQUEST,
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
        yield fork(getNode);
        break;
      }
      case CREATE_FINDER_FOLDER_REQUEST: {
        yield fork(createFolder);
        break;
      }
      case UPDATE_FINDER_FOLDER_REQUEST: {
        yield fork(updateFolder);
        break;
      }
      case DELETE_FINDER_NODES_REQUEST: {
        yield fork(deleteNodes);
        break;
      }
      case BULK_DELETE_FINDER_CARDS_REQUEST: {
        yield fork(bulkDeleteCards);
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

function* getParentNodeId() {
  const finderHistory = yield select((state) => state.finder.history);
  const parentNode = _.last(finderHistory);
  return parentNode._id;
}

function* getNode() {
  try {
    const nodeId = yield call(getParentNodeId);
    // TODO: make a request to get this information
    const node = MOCK_DIRECTORY_LOOKUP[nodeId];
    yield delay(1000);
    yield put(handleGetFinderNodeSuccess(node));
  } catch (error) {
    yield put(handleGetFinderNodeError(getErrorMessage(error)));
  }
}

function* createFolder() {
  try {
    const { name, permissions, permissionGroups } = yield select((state) => state.finder.edits.folder);

    // TODO: make a request to create folder
    yield delay(1000);
    const parentNodeId = yield call(getParentNodeId);
    const newFolder = {
      _id: 'some new folder',
      name,
      children: [],
      parent: MOCK_DIRECTORY_LOOKUP[parentNodeId],
      card: null
    };
    MOCK_DIRECTORY_LOOKUP[parentNodeId].children.push(newFolder);
    MOCK_DIRECTORY_LOOKUP[newFolder._id] = newFolder;

    yield put(requestGetFinderNode());
    yield put(handleCreateFinderFolderSuccess());
  } catch (error) {
    yield put(handleCreateFinderFolderError(getErrorMessage(error)));
  }
}

function* updateFolder() {
  try {
    const {
      selectedNodeIds,
      edits: {
        folder: { name, permissions, permissionGroups }
      }
    } = yield select((state) => state.finder);

    // TODO: make a request to create folder
    yield delay(1000);
    const selectedNodeId = selectedNodeIds[0];

    MOCK_DIRECTORY_LOOKUP[selectedNodeId].name = name;

    yield put(requestGetFinderNode());
    yield put(handleUpdateFinderFolderSuccess());
  } catch (error) {
    yield put(handleUpdateFinderFolderError(getErrorMessage(error)));
  }
}

function* deleteNodes() {
  try {
    const selectedNodeIds = yield select((state) => state.finder.selectedNodeIds);

    // TODO: make a request to delete folder
    yield delay(1000);
    selectedNodeIds.forEach(nodeId => {
      const { parent, children } = MOCK_DIRECTORY_LOOKUP[nodeId];
      if (parent) {
        parent.children = parent.children.filter(({ _id }) => _id !== nodeId);
      }

      if (children) {
        children.forEach(({ _id }) => {
          delete MOCK_DIRECTORY_LOOKUP[_id];
        })
      }

      delete MOCK_DIRECTORY_LOOKUP[nodeId];
    })
    
    yield put(requestGetFinderNode());
    yield put(handleDeleteFinderNodesSuccess());
  } catch (error) {
    yield put(handleDeleteFinderNodesError(getErrorMessage(error)));
  }
}

function* bulkDeleteCards() {
  try {
    const { selectedNodeIds } = yield select((state) => state.finder);
    yield call(doDelete, '/cards/bulk', selectedNodeIds);
    yield put(handleBulkDeleteFinderCardsSuccess(selectedNodeIds));
  } catch (error) {
    yield put(handleBulkDeleteFinderCardsError(getErrorMessage(error)));
  }
}

function* moveNode({ destinationId }) {
  try {
    const moveNodeIds = yield select((state) => state.finder.moveNodeIds);

    // TODO: make a request to move nodes
    // TODO: have better checks on history when moving to "drop" node
    yield delay(1000);
    moveNodeIds.forEach(nodeId => {
      const { parent } = MOCK_DIRECTORY_LOOKUP[nodeId];
      if (parent) {
        parent.children = parent.children.filter(({ _id }) => _id !== nodeId);
      }

      MOCK_DIRECTORY_LOOKUP[nodeId].parent = MOCK_DIRECTORY_LOOKUP[destinationId];
      MOCK_DIRECTORY_LOOKUP[destinationId].children.push(MOCK_DIRECTORY_LOOKUP[nodeId]);
    });

    yield put(requestGetFinderNode());
    yield put(handleMoveFinderNodesSuccess());
  } catch (error) {
    yield put(handleMoveFinderNodesError(getErrorMessage(error)));
  }
}

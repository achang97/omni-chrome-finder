import { take, call, all, fork, put, select, delay } from 'redux-saga/effects';
import _ from 'lodash';
import { doGet, doPost, doDelete, getErrorMessage } from 'utils/request';
import {
  GET_FINDER_NODE_REQUEST,
  CREATE_FINDER_FOLDER_REQUEST,
  UPDATE_FINDER_FOLDER_REQUEST,
  DELETE_FINDER_NODES_REQUEST,
  MOVE_FINDER_NODE_REQUEST,
} from 'actions/actionTypes';
import {
  requestGetFinderNode,
  handleGetFinderNodeSuccess,
  handleGetFinderNodeError,
  handleCreateFinderFolderSuccess,
  handleCreateFinderFolderError,
  handleUpdateFinderFolderSuccess,
  handleUpdateFinderFolderError,
  handleDeleteFinderFolderSuccess,
  handleDeleteFinderFolderError,
  handleMoveFinderNodeSuccess,
  handleMoveFinderNodeError
} from 'actions/finder';
import { MOCK_DIRECTORY_LOOKUP } from 'appConstants/finder';

export default function* watchFinderRequests() {
  while (true) {
    const action = yield take([
      GET_FINDER_NODE_REQUEST,
      CREATE_FINDER_FOLDER_REQUEST,
      UPDATE_FINDER_FOLDER_REQUEST,
      DELETE_FINDER_NODES_REQUEST,
      MOVE_FINDER_NODE_REQUEST
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
        yield fork(deleteFolder);
        break;
      }
      case MOVE_FINDER_NODE_REQUEST: {
        yield fork(moveNode);
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

function* getSelectedNodes() {
  const { activeNode, selectedIndices } = yield select((state) => state.finder);
  return activeNode.filter((node, i) => selectedIndices.includes(i));
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
    const {
      edits: {
        folder: { name, permissions, permissionGroups }
      }
    } = yield select((state) => state.finder);

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

}

function* deleteFolder() {

}

function* moveNode() {
  try {
    yield put(handleMoveFinderNodeSuccess());
  } catch (error) {
    yield put(handleMoveFinderNodeError(getErrorMessage(error)));
  }
}

import { take, call, all, fork, put, select, delay } from 'redux-saga/effects';
import { doGet, doPost, doDelete, getErrorMessage } from 'utils/request';
import {
  GET_FINDER_NODE_REQUEST,
  CREATE_FINDER_FOLDER_REQUEST,
  MOVE_FINDER_NODE_REQUEST
} from 'actions/actionTypes';
import {
  handleGetFinderNodeSuccess,
  handleGetFinderNodeError,
  handleCreateFinderFolderSuccess,
  handleCreateFinderFolderError,
  handleMoveFinderNodeSuccess,
  handleMoveFinderNodeError
} from 'actions/finder';
import { MOCK_DIRECTORY_LOOKUP } from 'appConstants/finder';

export default function* watchFinderRequests() {
  while (true) {
    const action = yield take([
      GET_FINDER_NODE_REQUEST,
      CREATE_FINDER_FOLDER_REQUEST,
      MOVE_FINDER_NODE_REQUEST
    ]);

    const { type, payload } = action;
    switch (type) {
      case GET_FINDER_NODE_REQUEST: {
        yield fork(getNode, payload);
        break;
      }
      case CREATE_FINDER_FOLDER_REQUEST: {
        yield fork(createFolder);
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

function* getNode({ nodeId }) {
  try {
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
    yield put(handleCreateFinderFolderSuccess());
  } catch (error) {
    yield put(handleCreateFinderFolderError(getErrorMessage(error)));
  }
}

function* moveNode() {
  try {
    yield put(handleMoveFinderNodeSuccess());
  } catch (error) {
    yield put(handleMoveFinderNodeError(getErrorMessage(error)));
  }
}

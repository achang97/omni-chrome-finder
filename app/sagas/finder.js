import { take, call, all, fork, put, select } from 'redux-saga/effects';
import { doGet, doPost, doDelete, getErrorMessage } from 'utils/request';
import { CREATE_FINDER_FOLDER_REQUEST, MOVE_FINDER_CONTENT_REQUEST } from 'actions/actionTypes';
import {
  handleCreateFinderFolderSuccess,
  handleCreateFinderFolderError,
  handleMoveFinderContentSuccess,
  handleMoveFinderContentError
} from 'actions/finder';

export default function* watchFinderRequests() {
  while (true) {
    const action = yield take([CREATE_FINDER_FOLDER_REQUEST, MOVE_FINDER_CONTENT_REQUEST]);

    const { type, payload } = action;
    switch (type) {
      case CREATE_FINDER_FOLDER_REQUEST: {
        yield fork(createFolder);
        break;
      }
      case MOVE_FINDER_CONTENT_REQUEST: {
        yield fork(moveContent);
        break;
      }
      default: {
        break;
      }
    }
  }
}

function* createFolder() {
  try {
    yield put(handleCreateFinderFolderSuccess());
  } catch (error) {
    yield put(handleCreateFinderFolderError(getErrorMessage(error)));
  }
}

function* moveContent() {
  try {
    yield put(handleMoveFinderContentSuccess());
  } catch (error) {
    yield put(handleMoveFinderContentError(getErrorMessage(error)));
  }
}

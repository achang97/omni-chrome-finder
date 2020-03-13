import { take, call, fork, put, select } from 'redux-saga/effects';
import { doGet, doPut } from '../utils/request';
import { GET_USER_REQUEST, SAVE_USER_REQUEST } from '../actions/actionTypes';
import {
  handleGetUserSuccess, handleGetUserError,
  handleSaveUserSuccess, handleSaveUserError,
} from '../actions/profile';

export default function* watchProfileRequests() {
  let action;

  while (action = yield take([GET_USER_REQUEST, SAVE_USER_REQUEST])) {
    const { type, /* payload */ } = action;
    switch (type) {
      case GET_USER_REQUEST: {
        yield fork(getUser);
        break;
      }
      case SAVE_USER_REQUEST: {
        yield fork(updateUser);
        break;
      }
      default: {
        break;
      }
    }
  }
}

function* getUser() {
  try {
    const { userJson } = yield call(doGet, '/users');
    yield put(handleGetUserSuccess(userJson));
  } catch (error) {
    const { response: { data } } = error;
    yield put(handleGetUserError(data.error));
  }
}

function* updateUser() {
  try {
    const { user, userEdits } = yield select(state => state.profile);
    const { userJson } = yield call(doPut, '/users', { user, update: userEdits });
    yield put(handleSaveUserSuccess(userJson));
  } catch (error) {
    const { response: { data } } = error;
    yield put(handleSaveUserError(error: data.error));
  }
}

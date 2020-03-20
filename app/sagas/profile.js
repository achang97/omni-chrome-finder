import { take, call, fork, put, select } from 'redux-saga/effects';
import { doGet, doPut } from '../utils/request';
import { GET_USER_REQUEST, SAVE_USER_REQUEST, CHANGE_USER_PERMISSIONS_REQUEST } from '../actions/actionTypes';
import {
  handleGetUserSuccess, handleGetUserError,
  handleSaveUserSuccess, handleSaveUserError,
  handleChangeUserPermissionsSuccess, handleChangeUserPermissionsError,
} from '../actions/profile';

export default function* watchProfileRequests() {
  let action;

  while (action = yield take([GET_USER_REQUEST, SAVE_USER_REQUEST, CHANGE_USER_PERMISSIONS_REQUEST])) {
    const { type, payload  } = action;
    switch (type) {
      case GET_USER_REQUEST: {
        yield fork(getUser);
        break;
      }
      case SAVE_USER_REQUEST: {
        yield fork(updateUser);
        break;
      }
      case CHANGE_USER_PERMISSIONS_REQUEST: {
        yield fork(changeUserPermissions, payload);
        break;
      }
      default: {
        break;
      }
    }
  }
}

function* changeUserPermissions({ updates }) {
  try {
    const { user } = yield select(state => state.profile);
    const { userJson } = yield call(doPut, '/users', { user, update: updates });
    yield put(handleChangeUserPermissionsSuccess(userJson));
  } catch (error) {
    const { response: { data } } = error;
    yield put(handleChangeUserPermissionsError(error: data.error));
  }
}

function* getUser() {
  try {
    const { userJson } = yield call(doGet, '/users');
    const integrations = yield call(doGet, '/users/me/integrations');
    yield put(handleGetUserSuccess({ ...userJson, integrations }));
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
    yield put(handleSaveUserError(data.error));
  }
}

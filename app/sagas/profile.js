import { take, call, fork, put, select } from 'redux-saga/effects';
import { doGet, doPut } from '../utils/request';
import { GET_USER_REQUEST, SAVE_USER_REQUEST, CHANGE_NOTIFICATION_PERMISSIONS_REQUEST } from '../actions/actionTypes';
import {
  handleGetUserSuccess, handleGetUserError,
  handleSaveUserSuccess, handleSaveUserError,
  handleChangeNotificationPermissionsSuccess, handleChangeNotificationPermissionsError,
} from '../actions/profile';

export default function* watchProfileRequests() {
  let action;

  while (action = yield take([GET_USER_REQUEST, SAVE_USER_REQUEST, CHANGE_NOTIFICATION_PERMISSIONS_REQUEST])) {
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
      case CHANGE_NOTIFICATION_PERMISSIONS_REQUEST: {
        yield fork(changeNotificationPermissions, payload);
        break;
      }
      default: {
        break;
      }
    }
  }
}

function* changeNotificationPermissions({ permissions }) {
  try {
    const { user } = yield select(state => state.profile);
    const { userJson } = yield call(doPut, '/users', { user, update: { notificationPermissions: permissions } });
    yield put(handleChangeNotificationPermissionsSuccess(userJson));
  } catch (error) {
    const { response: { data } } = error;
    yield put(handleChangeNotificationPermissionsError(error: data.error));
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

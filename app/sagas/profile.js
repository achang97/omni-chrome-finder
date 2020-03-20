import { take, call, fork, put, select } from 'redux-saga/effects';
import { doGet, doPut, doPost } from '../utils/request';
import { USER_PERMISSION_TYPE } from '../utils/constants';
import { GET_USER_REQUEST, SAVE_USER_REQUEST, UPDATE_USER_PERMISSIONS_REQUEST, LOGOUT_USER_INTEGRATION_REQUEST } from '../actions/actionTypes';
import {
  handleGetUserSuccess, handleGetUserError,
  handleSaveUserSuccess, handleSaveUserError,
  handleUpdateUserPermissionsSuccess, handleUpdateUserPermissionsError,
  handleLogoutUserIntegrationSuccess, handleLogoutUserIntegrationError,
} from '../actions/profile';

export default function* watchProfileRequests() {
  let action;

  while (action = yield take([GET_USER_REQUEST, SAVE_USER_REQUEST, UPDATE_USER_PERMISSIONS_REQUEST, LOGOUT_USER_INTEGRATION_REQUEST])) {
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
      case UPDATE_USER_PERMISSIONS_REQUEST: {
        yield fork(updatePermissions, payload);
        break;
      }
      case LOGOUT_USER_INTEGRATION_REQUEST: {
        yield fork(logoutUserIntegration, payload);
        break;
      }
      default: {
        break;
      }
    }
  }
}


function* updatePermissions({ type, permission }) {
  const keyName = type === USER_PERMISSION_TYPE.AUTOFIND ? 'autofindPermissions' : 'notificationPermissions';
  const permissionsObj = yield select(state => state.profile.user[keyName]);
  const update = { [keyName]: { ...permissionsObj, [permission]: !permissionsObj[permission] } };

  try {
    const { userJson } = yield call(doPut, '/users', { update });
    yield put(handleUpdateUserPermissionsSuccess(type, userJson));
  } catch (error) {
    const { response: { data } } = error;
    yield put(handleUpdateUserPermissionsError(type, data.error));
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
    const { userJson } = yield call(doPut, '/users', { update: userEdits });
    yield put(handleSaveUserSuccess(userJson));
  } catch (error) {
    const { response: { data } } = error;
    yield put(handleSaveUserError(data.error));
  }
}

function* logoutUserIntegration({ integration }) {
  try {
    const user = yield call(doPost, `/${integration}/signout`);
    yield put(handleLogoutUserIntegrationSuccess(integration, user));
  } catch (error) {
    const { response: { data } } = error;
    yield put(handleLogoutUserIntegrationError(integration, data.error));
  }
}


import { take, call, fork, put, all, select } from 'redux-saga/effects';
import { doGet, doPut, doPost, doDelete, getErrorMessage } from 'utils/request';
import { SETTING_SECTION_TYPE } from 'appConstants/profile';
import {
  GET_USER_REQUEST, GET_USER_ONBOARDING_STATS_REQUEST, SAVE_USER_REQUEST, UPDATE_USER_PERMISSIONS_REQUEST,
  LOGOUT_USER_INTEGRATION_REQUEST, UPDATE_PROFILE_PICTURE_REQUEST, DELETE_PROFILE_PICTURE_REQUEST
} from 'actions/actionTypes';
import {
  handleGetUserSuccess, handleGetUserError,
  handleGetUserOnboardingStatsSuccess, handleGetUserOnboardingStatsError,
  handleSaveUserSuccess, handleSaveUserError,
  handleUpdateProfilePictureSuccess, handleUpdateProfilePictureError,
  handleDeleteProfilePictureSuccess, handleDeleteProfilePictureError,
  handleUpdateUserPermissionsSuccess, handleUpdateUserPermissionsError,
  handleLogoutUserIntegrationSuccess, handleLogoutUserIntegrationError,
} from 'actions/profile';

export default function* watchProfileRequests() {
  let action;

  while (action = yield take([
    GET_USER_REQUEST, GET_USER_ONBOARDING_STATS_REQUEST, SAVE_USER_REQUEST, UPDATE_USER_PERMISSIONS_REQUEST,
    LOGOUT_USER_INTEGRATION_REQUEST, UPDATE_PROFILE_PICTURE_REQUEST, DELETE_PROFILE_PICTURE_REQUEST
  ])) {
    const { type, payload  } = action;
    switch (type) {
      case GET_USER_REQUEST: {
        yield fork(getUser);
        break;
      }
      case GET_USER_ONBOARDING_STATS_REQUEST: {
        yield fork(getUserOnboardingStats);
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
      case UPDATE_PROFILE_PICTURE_REQUEST: {
        yield fork(updateProfilePicture, payload);
        break;
      }
      case DELETE_PROFILE_PICTURE_REQUEST: {
        yield fork(deleteProfilePicture);
        break;
      }
      default: {
        break;
      }
    }
  }
}


function* updatePermissions({ type, permission }) {
  const keyName = type === SETTING_SECTION_TYPE.AUTOFIND ? 'autofindPermissions' : 'notificationPermissions';
  const permissionsObj = yield select(state => state.profile.user[keyName]);
  const update = { [keyName]: { ...permissionsObj, [permission]: !permissionsObj[permission] } };

  try {
    const { userJson } = yield call(doPut, '/users', { update });
    yield put(handleUpdateUserPermissionsSuccess(type, userJson));
  } catch (error) {
    yield put(handleUpdateUserPermissionsError(type, getErrorMessage(error)));
  }
}

function* getUser() {
  try {
    const [{ userJson }, integrations, analytics] = yield all([
      call(doGet, '/users'),
      call(doGet, '/users/me/integrations'),
      call(doGet, '/analytics/my/cards'),
    ]);

    const { user, ...userAnalytics } = analytics;
    yield put(handleGetUserSuccess({ ...userJson, integrations }, userAnalytics));
  } catch (error) {
    yield put(handleGetUserError(getErrorMessage(error)));
  }
}

function* getUserOnboardingStats() {
  try {
    const onboardingStats = yield call(doGet, '/users/me/onboarding/completeStats');
    yield put(handleGetUserOnboardingStatsSuccess(onboardingStats));
  } catch (error) {
    yield put(handleGetUserOnboardingStatsError(getErrorMessage(error)));
  }
}

function* updateUser() {
  try {
    const { user, userEdits } = yield select(state => state.profile);
    const { userJson } = yield call(doPut, '/users', { update: userEdits });
    yield put(handleSaveUserSuccess({ ...userJson, integrations: user.integrations }));
  } catch (error) {
    yield put(handleSaveUserError(getErrorMessage(error)));
  }
}

function* updateProfilePicture({ file }) {
  try {
    const integrations = yield select(state => state.profile.user.integrations);

    const formData = new FormData();
    formData.append('file', file);

    const { key } = yield call(doPost, '/files/upload', formData, { isForm: true });
    const { userJson } = yield call(doPut, '/users', { update: { profilePicture: key } });
    yield put(handleUpdateProfilePictureSuccess({ ...userJson, integrations }));
  } catch (error) {
    yield put(handleUpdateProfilePictureError(getErrorMessage(error)));
  }
}

function* deleteProfilePicture() {
  try {
    const { integrations, profilePicture } = yield select(state => state.profile.user);
    const [{ userJson }] = yield all([
      call(doPut, '/users', { update: { profilePicture: null } }),
      call(doDelete, `/files/${profilePicture}`)
    ]);
    yield put(handleDeleteProfilePictureSuccess({ ...userJson, integrations }));
  } catch (error) {
    yield put(handleDeleteProfilePictureError(getErrorMessage(error)));
  }
}

function* logoutUserIntegration({ integration }) {
  try {
    const user = yield call(doPost, `/${integration}/signout`);
    yield put(handleLogoutUserIntegrationSuccess(integration, user));
  } catch (error) {
    yield put(handleLogoutUserIntegrationError(integration, getErrorMessage(error)));
  }
}


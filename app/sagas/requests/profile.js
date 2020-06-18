import { take, call, fork, put, all, select } from 'redux-saga/effects';
import _ from 'lodash';
import { doGet, doPut, doPost, doDelete, getErrorMessage } from 'utils/request';
import { SETTING_SECTION_TYPE } from 'appConstants/profile';
import {
  GET_USER_REQUEST,
  GET_USER_ONBOARDING_STATS_REQUEST,
  UPDATE_USER_REQUEST,
  SAVE_USER_EDITS_REQUEST,
  UPDATE_USER_PERMISSIONS_REQUEST,
  LOGOUT_USER_INTEGRATION_REQUEST,
  UPDATE_PROFILE_PICTURE_REQUEST,
  DELETE_PROFILE_PICTURE_REQUEST
} from 'actions/actionTypes';
import {
  handleGetUserSuccess,
  handleGetUserError,
  handleGetUserOnboardingStatsSuccess,
  handleGetUserOnboardingStatsError,
  handleUpdateUserSuccess,
  handleUpdateUserError,
  handleSaveUserEditsSuccess,
  handleSaveUserEditsError,
  handleUpdateProfilePictureSuccess,
  handleUpdateProfilePictureError,
  handleDeleteProfilePictureSuccess,
  handleDeleteProfilePictureError,
  handleUpdateUserPermissionsSuccess,
  handleUpdateUserPermissionsError,
  handleLogoutUserIntegrationSuccess,
  handleLogoutUserIntegrationError
} from 'actions/profile';

export default function* watchProfileRequests() {
  while (true) {
    const action = yield take([
      GET_USER_REQUEST,
      GET_USER_ONBOARDING_STATS_REQUEST,
      UPDATE_USER_REQUEST,
      SAVE_USER_EDITS_REQUEST,
      UPDATE_USER_PERMISSIONS_REQUEST,
      LOGOUT_USER_INTEGRATION_REQUEST,
      UPDATE_PROFILE_PICTURE_REQUEST,
      DELETE_PROFILE_PICTURE_REQUEST
    ]);

    const { type, payload } = action;
    switch (type) {
      case GET_USER_REQUEST: {
        yield fork(getUser);
        break;
      }
      case GET_USER_ONBOARDING_STATS_REQUEST: {
        yield fork(getUserOnboardingStats);
        break;
      }
      case SAVE_USER_EDITS_REQUEST: {
        yield fork(saveUserEdits);
        break;
      }
      case UPDATE_USER_REQUEST: {
        yield fork(updateUser, payload);
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

function* callUpdateEndpoint(update) {
  const integrations = yield select((state) => state.profile.user.integrations);
  const userJson = yield call(doPut, '/users/me', update);
  return { ...userJson, integrations };
}

function* getUser() {
  try {
    const [userJson, integrations, analytics] = yield all([
      call(doGet, '/users/me'),
      call(doGet, '/users/me/integrations'),
      call(doGet, '/analytics/my/cards')
    ]);

    const { user, ...userAnalytics } = analytics;
    yield put(handleGetUserSuccess({ ...userJson, integrations }, userAnalytics));
  } catch (error) {
    yield put(handleGetUserError(getErrorMessage(error)));
  }
}

function* updatePermissions({ type, permission }) {
  const { autofindPermissions, notificationPermissions, widgetSettings } = yield select(
    (state) => state.profile.user
  );

  let update = {};
  switch (type) {
    case SETTING_SECTION_TYPE.AUTOFIND: {
      update = {
        [`autofindPermissions.${permission}`]: !autofindPermissions[permission]
      };
      break;
    }
    case SETTING_SECTION_TYPE.NOTIFICATIONS: {
      update = {
        [`notificationPermissions.${permission}`]: !notificationPermissions[permission]
      };
      break;
    }
    case SETTING_SECTION_TYPE.EXTERNAL_VERIFICATION: {
      const {
        externalLink: { disabledIntegrations }
      } = widgetSettings;

      const newDisabledIntegrations = disabledIntegrations.includes(permission)
        ? _.difference(disabledIntegrations, [permission])
        : _.union(disabledIntegrations, [permission]);

      update = {
        'widgetSettings.externalLink.disabledIntegrations': newDisabledIntegrations
      };
      break;
    }
    case SETTING_SECTION_TYPE.SEARCH_BAR: {
      const { searchBar } = widgetSettings;
      update = {
        [`widgetSettings.searchBar.${permission}.disabled`]: !searchBar[permission].disabled
      };
      break;
    }
    default:
      break;
  }

  try {
    const user = yield call(callUpdateEndpoint, update);
    yield put(handleUpdateUserPermissionsSuccess(type, user));
  } catch (error) {
    yield put(handleUpdateUserPermissionsError(type, getErrorMessage(error)));
  }
}

function* getUserOnboardingStats() {
  try {
    const { badge, percentage, performance } = yield call(
      doGet,
      '/users/me/onboarding/completeStats'
    );
    yield put(handleGetUserOnboardingStatsSuccess(badge, percentage, performance));
  } catch (error) {
    yield put(handleGetUserOnboardingStatsError(getErrorMessage(error)));
  }
}

function* updateUser({ update }) {
  try {
    const user = yield call(callUpdateEndpoint, update);
    yield put(handleUpdateUserSuccess(user));
  } catch (error) {
    yield put(handleUpdateUserError(getErrorMessage(error)));
  }
}

function* saveUserEdits() {
  try {
    const userEdits = yield select((state) => state.profile.userEdits);
    const user = yield call(callUpdateEndpoint, userEdits);
    yield put(handleSaveUserEditsSuccess(user));
  } catch (error) {
    yield put(handleSaveUserEditsError(getErrorMessage(error)));
  }
}

function* updateProfilePicture({ file }) {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const { key } = yield call(doPost, '/files/upload', formData, { isForm: true });
    const user = yield call(callUpdateEndpoint, { profilePicture: key });

    yield put(handleUpdateProfilePictureSuccess(user));
  } catch (error) {
    yield put(handleUpdateProfilePictureError(getErrorMessage(error)));
  }
}

function* deleteProfilePicture() {
  try {
    const { profilePicture } = yield select((state) => state.profile.user);
    const [user] = yield all([
      call(callUpdateEndpoint, { profilePicture: null }),
      call(doDelete, `/files/${profilePicture}`)
    ]);
    yield put(handleDeleteProfilePictureSuccess(user));
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

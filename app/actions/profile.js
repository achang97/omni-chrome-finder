import * as types from './actionTypes';

export function requestGetUser() {
  return { type: types.GET_USER_REQUEST, payload: { } };
}

export function handleGetUserSuccess(user, analytics) {
  return { type: types.GET_USER_SUCCESS, payload: { user, analytics } };
}

export function handleGetUserError(error) {
  return { type: types.GET_USER_ERROR, payload: { error } };
}

export function editUser() {
  return { type: types.EDIT_USER, payload: {} };
}

export function changeFirstname(text) {
  return { type: types.CHANGE_FIRSTNAME, payload: { text } };
}

export function changeLastname(text) {
  return { type: types.CHANGE_LASTNAME, payload: { text } };
}

export function changeBio(text) {
  return { type: types.CHANGE_BIO, payload: { text } };
}

export function requestSaveUser() {
  return { type: types.SAVE_USER_REQUEST, payload: {} };
}

export function handleSaveUserSuccess(user) {
  return { type: types.SAVE_USER_SUCCESS, payload: { user } };
}

export function handleSaveUserError(error) {
  return { type: types.SAVE_USER_ERROR, payload: { error } };
}

export function requestUpdateProfilePicture(file) {
  return { type: types.UPDATE_PROFILE_PICTURE_REQUEST, payload: { file } };
}

export function handleUpdateProfilePictureSuccess(user) {
  return { type: types.UPDATE_PROFILE_PICTURE_SUCCESS, payload: { user } };
}

export function handleUpdateProfilePictureError(error) {
  return { type: types.UPDATE_PROFILE_PICTURE_ERROR, payload: { error } };
}

export function requestDeleteProfilePicture() {
  return { type: types.DELETE_PROFILE_PICTURE_REQUEST, payload: { } };
}

export function handleDeleteProfilePictureSuccess(user) {
  return { type: types.DELETE_PROFILE_PICTURE_SUCCESS, payload: { user } };
}

export function handleDeleteProfilePictureError(error) {
  return { type: types.DELETE_PROFILE_PICTURE_ERROR, payload: { error } };
}


export function requestUpdateUserPermissions(type, permission) {
  return { type: types.UPDATE_USER_PERMISSIONS_REQUEST, payload: { type, permission } };
}

export function handleUpdateUserPermissionsSuccess(type, user) {
  return { type: types.UPDATE_USER_PERMISSIONS_SUCCESS, payload: { type, user } };
}

export function handleUpdateUserPermissionsError(type, error) {
  return { type: types.UPDATE_USER_PERMISSIONS_ERROR, payload: { type, error } };
}

export function requestLogoutUserIntegration(integration) {
  return { type: types.LOGOUT_USER_INTEGRATION_REQUEST, payload: { integration } };
}

export function handleLogoutUserIntegrationSuccess(integration, user) {
  return { type: types.LOGOUT_USER_INTEGRATION_SUCCESS, payload: { integration, user } };
}

export function handleLogoutUserIntegrationError(integration, error) {
  return { type: types.LOGOUT_USER_INTEGRATION_ERROR, payload: { integration, error } };
}


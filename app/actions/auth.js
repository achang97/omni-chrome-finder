import * as types from './actionTypes';

export function updateLoginEmail(email) {
  return { type: types.UPDATE_LOGIN_EMAIL, payload: { email } };
}

export function updateLoginPassword(password) {
  return { type: types.UPDATE_LOGIN_PASSWORD, payload: { password } };
}

export function requestLogin() {
  return { type: types.LOGIN_REQUEST, payload: { } };
}

export function handleLoginSuccess(user, token, refreshToken) {
  return { type: types.LOGIN_SUCCESS, payload: { user, token, refreshToken } };
}

export function handleLoginError(error) {
  return { type: types.LOGIN_ERROR, payload: { error } };
}

export function logout() {
	return { type: types.LOGOUT, payload: {} };
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
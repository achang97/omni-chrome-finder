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
	return { type: types.LOGOUT, payload: {} }
}
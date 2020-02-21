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

export function requestGetUser() {
  return { type: types.GET_USER_REQUEST, payload: { } };
}

export function handleGetUserSuccess(user) {
  return { type: types.GET_USER_SUCCESS, payload: { user } };
}

export function handleGetUserError(error) {
  return { type: types.GET_USER_ERROR, payload: { error } };
}


export function logout() {
	return { type: types.LOGOUT, payload: {} }
}
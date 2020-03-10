import * as types from './actionTypes';


export function requestGetUser() {
  return { type: types.GET_USER_REQUEST, payload: { } };
}

export function handleGetUserSuccess(user) {
  return { type: types.GET_USER_SUCCESS, payload: { user } };
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

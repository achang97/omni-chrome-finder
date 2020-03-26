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


export function updateSignupFirstName(firstName) {
  return { type: types.UPDATE_SIGNUP_FIRST_NAME, payload: { firstName } };
}

export function updateSignupLastName(lastName) {
  return { type: types.UPDATE_SIGNUP_LAST_NAME, payload: { lastName } };
}

export function updateSignupEmail(email) {
  return { type: types.UPDATE_SIGNUP_EMAIL, payload: { email } };
}

export function updateSignupPassword(password) {
  return { type: types.UPDATE_SIGNUP_PASSWORD, payload: { password } };
}


export function requestSignup() {
  return { type: types.SIGNUP_REQUEST, payload: { } };
}

export function handleSignupSuccess(user, token, refreshToken) {
  return { type: types.SIGNUP_SUCCESS, payload: { user, token, refreshToken } };
}

export function handleSignupError(error) {
  return { type: types.SIGNUP_ERROR, payload: { error } };
}


export function updateVerificationCode(code) {
  return { type: types.UPDATE_VERIFICATION_CODE, payload: { code } };
}

export function requestVerify() {
  return { type: types.VERIFY_REQUEST, payload: { } };
}

export function handleVerifySuccess(user) {
  return { type: types.VERIFY_SUCCESS, payload: { user } };
}

export function handleVerifyError(error) {
  return { type: types.VERIFY_ERROR, payload: { error } };
}

export function requestResendVerificationEmail() {
  return { type: types.RESEND_VERIFICATION_EMAIL_REQUEST, payload: { } };
}

export function handleResendVerificationEmailSuccess(user, token, refreshToken) {
  return { type: types.RESEND_VERIFICATION_EMAIL_SUCCESS, payload: { user, token, refreshToken } };
}

export function handleResendVerificationEmailError(error) {
  return { type: types.RESEND_VERIFICATION_EMAIL_ERROR, payload: { error } };
}

export function clearResendVerificationInfo() {
  return { type: types.CLEAR_RESEND_VERIFICATION_INFO, payload: { } };
}


export function syncAuthInfo(user, token, refreshToken) {
  return { type: types.SYNC_AUTH_INFO, payload: { user, token, refreshToken } };
}

export function logout() {
  return { type: types.LOGOUT, payload: {} };
}

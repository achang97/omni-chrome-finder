import { take, call, fork, put, select } from 'redux-saga/effects';
import { doPost } from '../utils/request';
import { LOGIN_REQUEST, SIGNUP_REQUEST, VERIFY_REQUEST, RESEND_VERIFICATION_EMAIL_REQUEST } from '../actions/actionTypes';
import {
  handleLoginSuccess, handleLoginError,
  handleSignupSuccess, handleSignupError,
  handleVerifySuccess, handleVerifyError,
  handleResendVerificationEmailSuccess, handleResendVerificationEmailError,
} from '../actions/auth';

export default function* watchAuthRequests() {
  let action;

  while (action = yield take([LOGIN_REQUEST, SIGNUP_REQUEST, VERIFY_REQUEST, RESEND_VERIFICATION_EMAIL_REQUEST])) {
    const { type, /* payload */ } = action;
    switch (type) {
      case LOGIN_REQUEST: {
        yield fork(login);
        break;
      }
      case SIGNUP_REQUEST: {
        yield fork(signup);
        break;
      }
      case VERIFY_REQUEST: {
        yield fork(verify);
        break;
      }
      case RESEND_VERIFICATION_EMAIL_REQUEST: {
        yield fork(resendVerificationEmail);
        break;
      }
      default: {
        break;
      }
    }
  }
}

function* login() {
  try {
    const { loginEmail, loginPassword } = yield select(state => state.auth);
    const { userJson, token, refreshToken } = yield call(doPost, '/users/login', { email: loginEmail, password: loginPassword });
    yield put(handleLoginSuccess(userJson, token, refreshToken));
  } catch (error) {
    const { response: { data: { error: { message } } } } = error;
    yield put(handleLoginError(message));
  }
}

function* signup() {
  try {
    const { signupFirstName, signupLastName, signupEmail, signupPassword } = yield select(state => state.auth);
    const { userJson, token, refreshToken } = yield call(doPost, '/users/signup', {
      firstname: signupFirstName, lastname: signupLastName, email: signupEmail, password: signupPassword
    });
    yield put(handleSignupSuccess(userJson, token, refreshToken));
  } catch (error) {
    const { response: { data: { error: { message } } } } = error;
    yield put(handleSignupError(message));
  }
}

function* verify() {
  try {
    const { verificationCode } = yield select(state => state.auth);
    yield call(doPost, '/users/verifyCheck', { code: verificationCode });
    yield put(handleVerifySuccess());
  } catch (error) {
    const { response: { data: { error: { message } } } } = error;
    yield put(handleVerifyError(message));
  }
}

function* resendVerificationEmail() {
  try {
    yield call(doPost, '/users/resendVerification');
    yield put(handleResendVerificationEmailSuccess());
  } catch (error) {
    const { response: { data: { error: { message } } } } = error;
    yield put(handleResendVerificationEmailError(message));
  }
}

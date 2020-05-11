import { take, call, all, fork, put, select } from 'redux-saga/effects';
import { doPost, getErrorMessage } from 'utils/request';
import {
  LOGIN_REQUEST,
  SIGNUP_REQUEST,
  SEND_RECOVERY_EMAIL_REQUEST,
  VERIFY_REQUEST,
  RESEND_VERIFICATION_EMAIL_REQUEST
} from 'actions/actionTypes';
import {
  handleLoginSuccess,
  handleLoginError,
  handleSignupSuccess,
  handleSignupError,
  handleVerifySuccess,
  handleVerifyError,
  handleResendVerificationEmailSuccess,
  handleResendVerificationEmailError,
  handleSendRecoveryEmailSuccess,
  handleSendRecoveryEmailError
} from 'actions/auth';
import { openModal } from 'actions/display';

export default function* watchAuthRequests() {
  while (true) {
    const action = yield take([
      LOGIN_REQUEST,
      SIGNUP_REQUEST,
      SEND_RECOVERY_EMAIL_REQUEST,
      VERIFY_REQUEST,
      RESEND_VERIFICATION_EMAIL_REQUEST
    ]);

    const { type } = action;
    switch (type) {
      case LOGIN_REQUEST: {
        yield fork(login);
        break;
      }
      case SIGNUP_REQUEST: {
        yield fork(signup);
        break;
      }
      case SEND_RECOVERY_EMAIL_REQUEST: {
        yield fork(sendRecoveryEmail);
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
    const { loginEmail, loginPassword } = yield select((state) => state.auth);
    const { token, refreshToken, ...userJson } = yield call(doPost, '/users/login', {
      email: loginEmail,
      password: loginPassword
    });
    yield put(handleLoginSuccess(userJson, token, refreshToken));
  } catch (error) {
    yield put(handleLoginError(getErrorMessage(error)));
  }
}

function* signup() {
  try {
    const { signupFirstName, signupLastName, signupEmail, signupPassword } = yield select(
      (state) => state.auth
    );
    const { token, refreshToken, ...userJson } = yield call(doPost, '/users/signup', {
      firstname: signupFirstName,
      lastname: signupLastName,
      email: signupEmail,
      password: signupPassword
    });
    yield put(handleSignupSuccess(userJson, token, refreshToken));
  } catch (error) {
    yield put(handleSignupError(getErrorMessage(error)));
  }
}

function* verify() {
  try {
    const verificationCode = yield select((state) => state.auth.verificationCode);
    const firstname = yield select((state) => state.profile.user.firstname);

    yield call(doPost, '/users/verifyCheck', { code: verificationCode });
    yield all([
      put(handleVerifySuccess()),
      put(
        openModal({
          title: `We've successfully verified your account, ${firstname}!`,
          buttonText: 'Ok!',
          showHeader: false
        })
      )
    ]);
  } catch (error) {
    yield put(handleVerifyError(getErrorMessage(error)));
  }
}

function* sendRecoveryEmail() {
  try {
    const email = yield select((state) => state.auth.recoveryEmail);
    yield call(doPost, '/users/forgotPassword', { email });
    yield put(handleSendRecoveryEmailSuccess());
  } catch (error) {
    yield put(handleSendRecoveryEmailError(getErrorMessage(error)));
  }
}

function* resendVerificationEmail() {
  try {
    yield call(doPost, '/users/resendVerification');
    yield put(handleResendVerificationEmailSuccess());
  } catch (error) {
    yield put(handleResendVerificationEmailError(getErrorMessage(error)));
  }
}

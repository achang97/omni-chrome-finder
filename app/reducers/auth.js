import * as types from 'actions/actionTypes';

export const initialState = {
  token: null,
  refreshToken: null,

  loginEmail: '',
  loginPassword: '',

  signupFirstName: '',
  signupLastName: '',
  signupEmail: '',
  signupPassword: '',

  recoveryEmail: '',

  verificationCode: ''
};

export default function authReducer(state = initialState, action) {
  const { type, payload = {} } = action;

  switch (type) {
    case types.UPDATE_LOGIN_EMAIL: {
      const { email } = payload;
      return { ...state, loginEmail: email };
    }
    case types.UPDATE_LOGIN_PASSWORD: {
      const { password } = payload;
      return { ...state, loginPassword: password };
    }

    case types.LOGIN_REQUEST: {
      return { ...state, isLoggingIn: true, loginError: null };
    }
    case types.LOGIN_SUCCESS: {
      const { token, refreshToken } = payload;
      return {
        ...state,
        isLoggingIn: false,
        token,
        refreshToken,
        loginEmail: '',
        loginPassword: ''
      };
    }
    case types.LOGIN_ERROR: {
      const { error } = payload;
      return { ...state, isLoggingIn: false, loginError: error };
    }

    case types.UPDATE_SIGNUP_FIRST_NAME: {
      const { firstName } = payload;
      return { ...state, signupFirstName: firstName };
    }
    case types.UPDATE_SIGNUP_LAST_NAME: {
      const { lastName } = payload;
      return { ...state, signupLastName: lastName };
    }
    case types.UPDATE_SIGNUP_EMAIL: {
      const { email } = payload;
      return { ...state, signupEmail: email };
    }
    case types.UPDATE_SIGNUP_PASSWORD: {
      const { password } = payload;
      return { ...state, signupPassword: password };
    }

    case types.SIGNUP_REQUEST: {
      return { ...state, isSigningUp: true, signupError: null };
    }
    case types.SIGNUP_SUCCESS: {
      const { token, refreshToken } = payload;
      return {
        ...state,
        isSigningUp: false,
        token,
        refreshToken,
        signupFirstName: '',
        signupLastName: '',
        signupEmail: '',
        signupPassword: ''
      };
    }
    case types.SIGNUP_ERROR: {
      const { error } = payload;
      return { ...state, isSigningUp: false, signupError: error };
    }

    case types.UPDATE_VERIFICATION_CODE: {
      const { code } = payload;
      return { ...state, verificationCode: code };
    }

    case types.UPDATE_RECOVERY_EMAIL: {
      const { email } = payload;
      return { ...state, recoveryEmail: email };
    }
    case types.SEND_RECOVERY_EMAIL_REQUEST: {
      return { ...state, isSendingRecoveryEmail: true, recoverySuccess: null, recoveryError: null };
    }
    case types.SEND_RECOVERY_EMAIL_SUCCESS: {
      return { ...state, isSendingRecoveryEmail: false, recoverySuccess: true, recoveryEmail: '' };
    }
    case types.SEND_RECOVERY_EMAIL_ERROR: {
      const { error } = payload;
      return {
        ...state,
        isSendingRecoveryEmail: false,
        recoverySuccess: false,
        recoveryError: error
      };
    }

    case types.VERIFY_REQUEST: {
      return { ...state, isVerifying: true, verifyError: null };
    }
    case types.VERIFY_SUCCESS: {
      const { token, refreshToken } = payload;
      return { ...state, isVerifying: false, verificationCode: '' };
    }
    case types.VERIFY_ERROR: {
      const { error } = payload;
      return { ...state, isVerifying: false, verifyError: error };
    }

    case types.RESEND_VERIFICATION_EMAIL_REQUEST: {
      return {
        ...state,
        isResendingVerification: true,
        resendVerificationSuccess: null,
        resendVerificationError: null
      };
    }
    case types.RESEND_VERIFICATION_EMAIL_SUCCESS: {
      const { token, refreshToken } = payload;
      return {
        ...state,
        isResendingVerification: false,
        resendVerificationSuccess: true,
        resendVerificationError: ''
      };
    }
    case types.RESEND_VERIFICATION_EMAIL_ERROR: {
      const { error } = payload;
      return {
        ...state,
        isResendingVerification: false,
        resendVerificationSuccess: false,
        resendVerificationError: error
      };
    }
    case types.CLEAR_RESEND_VERIFICATION_INFO: {
      return { ...state, isResendingVerification: false, resendVerificationSuccess: null };
    }

    case types.SYNC_AUTH_INFO: {
      const { token, refreshToken } = payload;
      return { ...state, isLoggingIn: false, loginError: null, token, refreshToken };
    }

    default:
      return state;
  }
}

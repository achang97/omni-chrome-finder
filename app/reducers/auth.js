import * as types from '../actions/actionTypes';

const initialState = {
  token: null,
  refreshToken: null,

  loginEmail: '',
  loginPassword: '',
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
      return { ...state, isLoggingIn: false, token, refreshToken };
    }
    case types.SYNC_AUTH_INFO: {
      const { token, refreshToken } = payload;
      return { ...state, isLoggingIn: false, loginError: null, token, refreshToken };
    }
    case types.LOGIN_ERROR: {
      const { error } = payload;
      return { ...state, isLoggingIn: false, loginError: error };
    }

    default:
      return state;
  }
}

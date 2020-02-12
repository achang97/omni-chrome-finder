import * as types from '../actions/actionTypes';
import _ from 'underscore';
import { EditorState } from 'draft-js';

const initialState = {
  isLoggedIn: false,
  user: {},
  token: null,
  refreshToken: null,

  loginEmail: '',
  loginPassword: '',
};

export default function auth(state = initialState, action) {
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
  		const { user, token, refreshToken } = payload;
  		return { ...state, isLoggingIn: false, isLoggedIn: true, user, token, refreshToken };
  	}
  	case types.LOGIN_ERROR: {
  		const { error } = payload;
  		return { ...state, isLoggingIn: false, loginError: error };
  	}

    default:
      return state;
  }
}

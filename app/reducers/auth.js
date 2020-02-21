import * as types from '../actions/actionTypes';
import _ from 'underscore';
import { EditorState } from 'draft-js';
import { getStorageName } from '../utils/constants';

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
      chrome.storage.sync.set({
        [getStorageName('auth')]: JSON.stringify({ user, token, refreshToken, isLoggedIn: true })
      });
  		return { ...state, isLoggingIn: false, isLoggedIn: true, user, token, refreshToken };
  	}
    case types.SYNC_LOGIN: {
      const { user, token, refreshToken } = payload;
      return { ...state, isLoggingIn: false, isLoggedIn: true, user, token, refreshToken };
    }
  	case types.LOGIN_ERROR: {
  		const { error } = payload;
  		return { ...state, isLoggingIn: false, loginError: error };
  	}

    case types.GET_USER_REQUEST: {
      return { ...state, isGettingUser: true, getUserError: null };
    }
    case types.GET_USER_SUCCESS: {
      const { user } = payload;
      return { ...state, isGettingUser: false, user };
    }
    case types.GET_USER_ERROR: {
      const { error } = payload;
      return { ...state, isGettingUser: false, getUserError: error };
    }

    default:
      return state;
  }
}

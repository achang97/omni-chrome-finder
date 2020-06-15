import { take, select } from 'redux-saga/effects';
import {
  LOGIN_SUCCESS,
  SIGNUP_SUCCESS,
  VERIFY_SUCCESS,
  GET_USER_SUCCESS,
  LOGOUT
} from 'actions/actionTypes';
import { CHROME } from 'appConstants';
import { setStorage } from 'utils/storage';

export default function* watchAuthActions() {
  while (true) {
    const action = yield take([
      LOGIN_SUCCESS,
      SIGNUP_SUCCESS,
      VERIFY_SUCCESS,
      GET_USER_SUCCESS,
      LOGOUT
    ]);

    const { type, payload } = action;
    switch (type) {
      case LOGIN_SUCCESS:
      case SIGNUP_SUCCESS: {
        setStorage(CHROME.STORAGE.AUTH, payload);
        break;
      }
      case VERIFY_SUCCESS: {
        const {
          auth: { token, refreshToken },
          profile: { user }
        } = yield select((state) => state);
        setStorage(CHROME.STORAGE.AUTH, { user, token, refreshToken });
        break;
      }
      case GET_USER_SUCCESS: {
        const { user } = payload;
        const { token, refreshToken } = yield select((state) => state.auth);
        setStorage(CHROME.STORAGE.AUTH, { user, token, refreshToken });
        break;
      }
      case LOGOUT: {
        setStorage(CHROME.STORAGE.AUTH, { user: {}, token: null, refreshToken: null });
        break;
      }
      default: {
        break;
      }
    }
  }
}

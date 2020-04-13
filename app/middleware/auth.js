import { setStorage } from 'utils/storage';
import * as types from 'actions/actionTypes';
import { identifyUser } from 'utils/heap';
import { CHROME } from 'appConstants';

const authMiddleware = store => next => (action) => {
  const nextAction = next(action);
  const { type, payload } = action;

  switch (type) {
    case types.LOGIN_SUCCESS:
    case types.SIGNUP_SUCCESS: {
      setStorage(CHROME.STORAGE.AUTH, payload);
      identifyUser(payload.user);
      break;
    }
    case types.VERIFY_SUCCESS: {
      const { auth: { token, refreshToken }, profile: { user } } = store.getState();
      setStorage(CHROME.STORAGE.AUTH, { user, token, refreshToken });
      break;
    }
    case types.GET_USER_SUCCESS: {
      const { payload: { user } } = action;
      const { auth: { token, refreshToken } } = store.getState();
      setStorage(CHROME.STORAGE.AUTH, { user, token, refreshToken });
      break;
    }
    case types.LOGOUT: {
      setStorage(CHROME.STORAGE.AUTH, { user: {}, token: null, refreshToken: null });
      break;
    }
    default: {
      break;
    }
  }

  return nextAction;
};

export default authMiddleware;

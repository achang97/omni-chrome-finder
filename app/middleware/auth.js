import { setStorage } from '../utils/storage';
import * as types from '../actions/actionTypes';

const authMiddleware = store => next => (action) => {
  const { type, payload } = action;

  switch (type) {
    case types.LOGIN_SUCCESS: {
      setStorage('auth', payload);
      break;
    }
    case types.GET_USER_SUCCESS: {
      const { payload: { user } } = action;
      const { auth: { token, refreshToken } } = store.getState();
      setStorage('auth', { user, token, refreshToken });
      break;
    }
    case types.LOGOUT: {
      setStorage('auth', { user: {}, token: null, refreshToken: null });
      break;
    }
    default: {
      break;
    }
  }

  return next(action);
};

export default authMiddleware;

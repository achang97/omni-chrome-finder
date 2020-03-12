import { setStorage } from '../utils/storage';
import { LOGOUT, LOGIN_SUCCESS, GET_USER_SUCCESS, GET_TASKS_REQUEST } from '../actions/actionTypes';

const authMiddleware = store => next => (action) => {
  const { type, payload } = action;

  switch (type) {
    case LOGIN_SUCCESS:
      setStorage('auth', payload);
      store.dispatch({ type: GET_TASKS_REQUEST });
      break;
    case GET_USER_SUCCESS: {
      const { payload: { user } } = action;
      const { auth: { token, refreshToken } } = store.getState();
      setStorage('auth', { user, token, refreshToken });
      break;
    }
    case LOGOUT: {
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

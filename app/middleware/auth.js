import { setStorage } from '../utils/storage';
import * as types from '../actions/actionTypes';
import { addScript } from '../utils/heap';

const authMiddleware = store => next => (action) => {
  const nextAction = next(action);
  const { type, payload } = action;

  switch (type) {
    case types.LOGIN_SUCCESS:
    case types.SIGNUP_SUCCESS: {
      setStorage('auth', payload);
      const user = payload.user;
      if(!window.location.href.includes("heapanalytics")) {
          let identify = `window.heap.identify("${user.email}"); 
            window.heap.addUserProperties({'Name': "${user.firstname}" + " " + "${user.lastname}",'Company': "${user.company.companyName}", 'Role': "${user.role}"});`
          addScript({code: identify, shouldRemove: true})
      } 
      break;
    }
    case types.VERIFY_SUCCESS: {
      const { auth: { token, refreshToken }, profile: { user } } = store.getState();
      setStorage('auth', { user, token, refreshToken });
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

  return nextAction;
};

export default authMiddleware;

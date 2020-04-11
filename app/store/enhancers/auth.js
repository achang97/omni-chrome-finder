import { addStorageListener } from 'utils/storage';
import { syncAuthInfo, logout } from 'actions/auth';

export default function () {
  return next => (reducer, initialState) => {
    const store = next(reducer, initialState);
    addStorageListener('auth', ({ newValue }) => {
      if (!newValue.token && store.getState().auth.token) {
        store.dispatch(logout());
      } else if (newValue.token) {
        const { user, token, refreshToken } = newValue;
        store.dispatch(syncAuthInfo(user, token, refreshToken));
      }
    });
    return store;
  };
}
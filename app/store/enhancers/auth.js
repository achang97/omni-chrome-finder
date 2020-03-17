import { getStorageName } from '../../utils/storage';
import { syncAuthInfo, logout } from '../../actions/auth';

export default function () {
  return next => (reducer, initialState) => {
    const store = next(reducer, initialState);
    chrome.storage.onChanged.addListener((changes, namespace) => {
      Object.entries(changes).forEach(([key, change]) => {
        const { newValue } = change;
        if (namespace === 'sync' && key === getStorageName('auth')) {
          const newValueJSON = newValue ? JSON.parse(newValue) : newValue;

          if (!newValueJSON.token && store.getState().auth.token) {
            store.dispatch(logout());
          } else if (newValueJSON.token) {
            const { user, token, refreshToken } = newValueJSON;
            store.dispatch(syncAuthInfo(user, token, refreshToken));
          }
        }
      });
    });
    return store;
  };
}
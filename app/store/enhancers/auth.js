import { CHROME } from 'appConstants';
import { addStorageListener } from 'utils/storage';
import { syncAuthInfo, logout } from 'actions/auth';
import * as Sentry from '@sentry/browser';

function identifySentryUser(user) {
  Sentry.configureScope((scope) => {
    if (user) {
      scope.setUser({ email: user.email });
    } else {
      scope.setUser(null);
    }
  });
}

export default function () {
  return (next) => (reducer, initialState) => {
    const store = next(reducer, initialState);
    addStorageListener(CHROME.STORAGE.AUTH, ({ newValue }) => {
      if (!newValue.token && store.getState().auth.token) {
        store.dispatch(logout());
        identifySentryUser(null);
      } else if (newValue.token) {
        const { user, token, refreshToken } = newValue;
        store.dispatch(syncAuthInfo(user, token, refreshToken));
        identifySentryUser(user);
      }
    });
    return store;
  };
}

import { getStorageName } from '../../utils/storage';
import * as types from '../../actions/actionTypes';

function setUpAuthSync(store) {
  chrome.storage.onChanged.addListener((changes, namespace) => {
    Object.entries(changes).forEach(([key, change]) => {
      const { newValue } = change;
      if (namespace === 'sync' && key === getStorageName('auth')) {
        const newValueJSON = newValue ? JSON.parse(newValue) : newValue;

        if (!newValueJSON.token && store.getState().auth.token) {
          store.dispatch({ type: types.LOGOUT });
        } else if (newValueJSON.token) {
          store.dispatch({ type: types.SYNC_AUTH_INFO, payload: newValueJSON });
        }
      }
    });
  });
}

export default setUpAuthSync;

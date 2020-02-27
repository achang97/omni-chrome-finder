import { getStorageName } from './constants';
import * as types from '../actions/actionTypes';

function setUpAuthSync(store) {
  chrome.storage.onChanged.addListener(function(changes, namespace) {
    for (const key in changes) {
      const { oldValue, newValue } = changes[key];
      if (namespace === 'sync' && key === getStorageName('auth')) {
        const oldValueJSON = oldValue ? JSON.parse(oldValue) : oldValue;
        const newValueJSON = newValue ? JSON.parse(newValue) : newValue;

        if (!newValueJSON.token) {
          store.dispatch({ type: types.LOGOUT });
        } else if (newValueJSON.token) {
          store.dispatch({ type: types.SYNC_LOGIN, payload: newValueJSON });
        }
      }
    }
  });  
}

export default setUpAuthSync;
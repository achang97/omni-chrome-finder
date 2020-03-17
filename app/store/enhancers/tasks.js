import { getStorageName } from '../../utils/storage';
import * as types from '../../actions/actionTypes';

export default function () {
  return next => (reducer, initialState) => {
    const store = next(reducer, initialState);
    chrome.storage.onChanged.addListener((changes, namespace) => {
      Object.entries(changes).forEach(([key, change]) => {
        const { newValue } = change;
        if (namespace === 'sync' && key === getStorageName('tasks')) {
          const newValueJSON = newValue ? JSON.parse(newValue) : newValue;
        }
      });
    });
    return store;
  };
}
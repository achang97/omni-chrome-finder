import { CHROME } from 'appConstants';
import { addStorageListener } from 'utils/storage';
import { syncTasks } from 'actions/tasks';

export default function () {
  return (next) => (reducer, initialState) => {
    const store = next(reducer, initialState);
    addStorageListener(CHROME.STORAGE.TASKS, ({ newValue }) => {
      if (newValue) {
        store.dispatch(syncTasks(newValue));
      }
    });
    return store;
  };
}

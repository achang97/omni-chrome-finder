import { addStorageListener } from '../../utils/storage';
import * as types from '../../actions/actionTypes';
import { syncTasks } from '../../actions/tasks';

export default function () {
  return next => (reducer, initialState) => {
    const store = next(reducer, initialState);
    addStorageListener('tasks', ({ newValue }) => {
      if (newValue) {        
        store.dispatch(syncTasks(newValue));
      }
    });
    return store;
  };
}
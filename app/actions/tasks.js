import * as types from './actionTypes';

/* Create behavior */
export function updateTasksTab(tabIndex) {
  return { type: types.UPDATE_TASKS_TAB, payload: { tabIndex } };
}

import * as types from './actionTypes';

/* Create behavior */
export function updateTasksTab(tabIndex) {
  return { type: types.UPDATE_TASKS_TAB, payload: { tabIndex } };
}

export function requestGetTasks() {
	return { type: types.GET_TASKS_REQUEST, payload: {} };
}
export function handleGetTasksSuccess(notifs) {
	return { type: types.GET_TASKS_SUCCESS, payload: { notifs } };
}
export function handleGetTasksError(error) {
	return { type: types.GET_TASKS_ERROR, payload: { error } };
}

export function requestMarkUpToDateFromTasks(cardId) {
	return { type: types.MARK_UP_TO_DATE_FROM_TASKS_REQUEST, payload: { cardId } };
}
export function handleMarkUpToDateFromTasksSuccess() {
	return { type: types.MARK_UP_TO_DATE_FROM_TASKS_SUCCESS, payload: {  } };
}
export function handleMarkUpToDateFromTasksError(error) {
	return { type: types.MARK_UP_TO_DATE_FROM_TASKS_ERROR, payload: { error } };
}

export function requestDismissTask(notificationId) {
	return { type: types.DISMISS_TASK_REQUEST, payload: { notificationId } };
}
export function handleDismissTaskSuccess() {
	return { type: types.DISMISS_TASK_SUCCESS, payload: {  } };
}
export function handleDismissTaskError(error) {
	return { type: types.DISMISS_TASK_ERROR, payload: { error } };
}
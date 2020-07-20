import * as types from './actionTypes';

/* Create behavior */
export function updateTasksTab(tabIndex) {
  return { type: types.UPDATE_TASKS_TAB, payload: { tabIndex } };
}

export function updateTasksOpenSection(section) {
  return { type: types.UPDATE_TASKS_OPEN_SECTION, payload: { section } };
}

export function requestGetTasks() {
  return { type: types.GET_TASKS_REQUEST, payload: {} };
}
export function handleGetTasksSuccess(tasks) {
  return { type: types.GET_TASKS_SUCCESS, payload: { tasks } };
}
export function handleGetTasksError(error) {
  return { type: types.GET_TASKS_ERROR, payload: { error } };
}

export function requestMarkUpToDateFromTasks(taskId, cardId) {
  return { type: types.MARK_UP_TO_DATE_FROM_TASKS_REQUEST, payload: { taskId, cardId } };
}
export function handleMarkUpToDateFromTasksSuccess(taskId, card) {
  return { type: types.MARK_UP_TO_DATE_FROM_TASKS_SUCCESS, payload: { taskId, card } };
}
export function handleMarkUpToDateFromTasksError(taskId, error) {
  return { type: types.MARK_UP_TO_DATE_FROM_TASKS_ERROR, payload: { taskId, error } };
}

export function requestDismissTask(taskId) {
  return { type: types.DISMISS_TASK_REQUEST, payload: { taskId } };
}
export function handleDismissTaskSuccess(taskId) {
  return { type: types.DISMISS_TASK_SUCCESS, payload: { taskId } };
}
export function handleDismissTaskError(taskId, error) {
  return { type: types.DISMISS_TASK_ERROR, payload: { taskId, error } };
}

export function requestApproveEditAccess(taskId, cardId, requestorId) {
  return { type: types.APPROVE_EDIT_ACCESS_REQUEST, payload: { taskId, cardId, requestorId } };
}
export function handleApproveEditAccessSuccess(taskId) {
  return { type: types.APPROVE_EDIT_ACCESS_SUCCESS, payload: { taskId } };
}
export function handleApproveEditAccessError(taskId, error) {
  return { type: types.APPROVE_EDIT_ACCESS_ERROR, payload: { taskId, error } };
}

export function requestRejectEditAccess(taskId, cardId, requestorId) {
  return { type: types.REJECT_EDIT_ACCESS_REQUEST, payload: { taskId, cardId, requestorId } };
}
export function handleRejectEditAccessSuccess(taskId) {
  return { type: types.REJECT_EDIT_ACCESS_SUCCESS, payload: { taskId } };
}
export function handleRejectEditAccessError(taskId, error) {
  return { type: types.REJECT_EDIT_ACCESS_ERROR, payload: { taskId, error } };
}

export function removeTask(taskId) {
  return { type: types.REMOVE_TASK, payload: { taskId } };
}

export function syncTasks(tasks) {
  return { type: types.SYNC_TASKS, payload: { tasks } };
}

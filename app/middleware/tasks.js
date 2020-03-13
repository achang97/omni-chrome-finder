import { setStorage } from '../utils/storage';
import { GET_TASKS_SUCCESS, LOGIN_SUCCESS, GET_USER_SUCCESS, GET_TASKS_REQUEST } from '../actions/actionTypes';

const tasksMiddleware = store => next => (action) => {
  const { type, payload } = action;

  switch (type) {
  }

  return next(action);
};

export default tasksMiddleware;


// export function handleGetTasksSuccess(notifs) {
//   return { type: types.GET_TASKS_SUCCESS, payload: { notifs } };
// }

// export function handleMarkUpToDateFromTasksSuccess() {
//   return { type: types.MARK_UP_TO_DATE_FROM_TASKS_SUCCESS, payload: { } };
// }

// export function requestDismissTask(notificationId) {
//   return { type: types.DISMISS_TASK_REQUEST, payload: { notificationId } };
// }


// function saveState(state) {
//   chrome.storage.local.set({ state: JSON.stringify(state) });
// }

// // todos unmarked count
// function setBadge(todos) {
//   if (chrome.browserAction) {
//     const count = todos.filter(todo => !todo.marked).length;
//     chrome.browserAction.setBadgeText({ text: count > 0 ? count.toString() : '' });
//   }
// }

// export default function () {
//   return next => (reducer, initialState) => {
//     const store = next(reducer, initialState);
//     store.subscribe(() => {
//       const state = store.getState();
//       saveState(state);
//       setBadge(state.todos);
//     });
//     return store;
//   };
// }
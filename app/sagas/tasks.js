import { take, call, fork, put } from 'redux-saga/effects';
import { doGet, doPost, doPut } from '../utils/request';
import { GET_TASKS_REQUEST, MARK_UP_TO_DATE_FROM_TASKS_REQUEST, DISMISS_TASK_REQUEST } from '../actions/actionTypes';
import {
  handleGetTasksSuccess, handleGetTasksError,
  handleMarkUpToDateFromTasksSuccess, handleMarkUpToDateFromTasksError,
  handleDismissTaskSuccess, handleDismissTaskError,
} from '../actions/tasks';

export default function* watchTasksRequests() {
  let action;

  while (action = yield take([
    GET_TASKS_REQUEST, MARK_UP_TO_DATE_FROM_TASKS_REQUEST,
    DISMISS_TASK_REQUEST
  ])) {
    const { type, payload } = action;
    switch (type) {
      case GET_TASKS_REQUEST: {
        yield fork(getTasks);
        break;
      }
      case MARK_UP_TO_DATE_FROM_TASKS_REQUEST: {
        yield fork(markUpToDateFromTasks, payload);
        break;
      }
      case DISMISS_TASK_REQUEST: {
        yield fork(dimissTask, payload);
        break;
      }
      default: {
        break;
      }
    }
  }
}

function* getTasks() {
  try {
    const { notifs } = yield call(doGet, '/notifications');
    yield put(handleGetTasksSuccess(notifs));
  } catch (error) {
    console.log(error)
    const { response: { data } } = error;
    yield put(handleGetTasksError(data.error));
  }
}

function* markUpToDateFromTasks({ taskId, cardId }) {
  try {
    yield call(doPost, '/cards/uptodate', { cardId });
    yield put(handleMarkUpToDateFromTasksSuccess(taskId));
  } catch (error) {
    const { response: { data } } = error;
    yield put(handleMarkUpToDateFromTasksError(taskId, data.error));
  }
}

function* dimissTask({ taskId }) {
  try {
    yield call(doPut, '/notifications', { update: { resolved: true }, notificationId: taskId });
    yield put(handleDismissTaskSuccess(taskId));
  } catch (error) {
    const { response: { data } } = error;
    yield put(handleDismissTaskError(taskId, data.error));
  }
}

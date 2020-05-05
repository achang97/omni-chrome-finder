import { take, call, fork, put } from 'redux-saga/effects';
import { doGet, doPost, doPut, getErrorMessage } from 'utils/request';
import {
  GET_TASKS_REQUEST, MARK_UP_TO_DATE_FROM_TASKS_REQUEST,
  DISMISS_TASK_REQUEST, APPROVE_CARD_FROM_TASKS_REQUEST
} from 'actions/actionTypes';
import {
  handleGetTasksSuccess, handleGetTasksError,
  handleMarkUpToDateFromTasksSuccess, handleMarkUpToDateFromTasksError,
  handleDismissTaskSuccess, handleDismissTaskError,
  handleApproveCardFromTasksSuccess, handleApproveCardFromTasksError,
} from 'actions/tasks';

export default function* watchTasksRequests() {
  let action;

  while (action = yield take([
    GET_TASKS_REQUEST, MARK_UP_TO_DATE_FROM_TASKS_REQUEST,
    DISMISS_TASK_REQUEST, APPROVE_CARD_FROM_TASKS_REQUEST
  ])) {
    const { type, payload } = action;
    switch (type) {
      case GET_TASKS_REQUEST: {
        yield fork(getTasks);
        break;
      }
      case MARK_UP_TO_DATE_FROM_TASKS_REQUEST: {
        yield fork(markUpToDate, payload);
        break;
      }
      case DISMISS_TASK_REQUEST: {
        yield fork(dismissTask, payload);
        break;
      }
      case APPROVE_CARD_FROM_TASKS_REQUEST: {
        yield fork(approveCard, payload);
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
    const { notifs: tasks } = yield call(doGet, '/notifications', { resolved: false });
    yield put(handleGetTasksSuccess(tasks));
  } catch (error) {
    yield put(handleGetTasksError(getErrorMessage(error)));
  }
}

function* markUpToDate({ taskId, cardId }) {
  try {
    const updatedCard = yield call(doPost, `/cards/${cardId}/markUpToDate`);
    yield put(handleMarkUpToDateFromTasksSuccess(taskId, updatedCard));
  } catch (error) {
    yield put(handleMarkUpToDateFromTasksError(taskId, getErrorMessage(error)));
  }
}

function* dismissTask({ taskId }) {
  try {
    yield call(doPut, '/notifications', { update: { resolved: true }, notificationId: taskId });
    yield put(handleDismissTaskSuccess(taskId));
  } catch (error) {
    yield put(handleDismissTaskError(taskId, getErrorMessage(error)));
  }
}

function* approveCard({ taskId, cardId }) {
  try {
    const updatedCard = yield call(doPost, `/cards/${cardId}/approve`);
    yield put(handleApproveCardFromTasksSuccess(taskId, updatedCard));
  } catch (error) {
    yield put(handleApproveCardFromTasksError(taskId, getErrorMessage(error)));
  }
}

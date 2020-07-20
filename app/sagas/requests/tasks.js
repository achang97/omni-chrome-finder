import { take, call, fork, put } from 'redux-saga/effects';
import { doGet, doPost, doPut, getErrorMessage } from 'utils/request';
import {
  GET_TASKS_REQUEST,
  MARK_UP_TO_DATE_FROM_TASKS_REQUEST,
  DISMISS_TASK_REQUEST,
  APPROVE_EDIT_ACCESS_REQUEST,
  REJECT_EDIT_ACCESS_REQUEST
} from 'actions/actionTypes';
import {
  handleGetTasksSuccess,
  handleGetTasksError,
  handleMarkUpToDateFromTasksSuccess,
  handleMarkUpToDateFromTasksError,
  handleDismissTaskSuccess,
  handleDismissTaskError,
  handleApproveEditAccessSuccess,
  handleApproveEditAccessError,
  handleRejectEditAccessSuccess,
  handleRejectEditAccessError
} from 'actions/tasks';

export default function* watchTasksRequests() {
  while (true) {
    const action = yield take([
      GET_TASKS_REQUEST,
      MARK_UP_TO_DATE_FROM_TASKS_REQUEST,
      DISMISS_TASK_REQUEST,
      APPROVE_EDIT_ACCESS_REQUEST,
      REJECT_EDIT_ACCESS_REQUEST
    ]);

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
      case APPROVE_EDIT_ACCESS_REQUEST: {
        yield fork(approveEditAccess, payload);
        break;
      }
      case REJECT_EDIT_ACCESS_REQUEST: {
        yield fork(rejectEditAccess, payload);
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
    const tasks = yield call(doGet, '/notifications', { resolved: false });
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
    yield call(doPut, `/notifications/${taskId}`, { resolved: true });
    yield put(handleDismissTaskSuccess(taskId));
  } catch (error) {
    yield put(handleDismissTaskError(taskId, getErrorMessage(error)));
  }
}

function* approveEditAccess({ taskId, cardId, requestorId }) {
  try {
    yield call(doPost, `/cards/${cardId}/approveEditAccessRequest`, { userId: requestorId });
    yield put(handleApproveEditAccessSuccess(taskId));
  } catch (error) {
    yield put(handleApproveEditAccessError(taskId, getErrorMessage(error)));
  }
}

function* rejectEditAccess({ taskId, cardId, requestorId }) {
  try {
    yield call(doPost, `/cards/${cardId}/rejectEditAccessRequest`, { userId: requestorId });
    yield put(handleRejectEditAccessSuccess(taskId));
  } catch (error) {
    yield put(handleRejectEditAccessError(taskId, getErrorMessage(error)));
  }
}

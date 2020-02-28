import { delay } from 'redux-saga';
import { take, call, fork, all, cancel, cancelled, put, select } from 'redux-saga/effects';
import { doGet, doPost, doPut, doDelete } from '../utils/request'
import { GET_TASKS_REQUEST, MARK_UP_TO_DATE_FROM_TASKS_REQUEST } from '../actions/actionTypes';
import { 
  handleGetTasksSuccess, handleGetTasksError,
  handleMarkUpToDateFromTasksSuccess, handleMarkUpToDateFromTasksError
} from '../actions/tasks';

export default function* watchTasksRequests() {
  let action;

  while (action = yield take([GET_TASKS_REQUEST, MARK_UP_TO_DATE_FROM_TASKS_REQUEST])) {
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
    }
  }
}

function* getTasks() {
  try {
    const { notifs } = yield call(doGet, '/notifications');
    yield put(handleGetTasksSuccess(notifs));
  } catch(error) {
    const { response: { date } } = error;
    yield put(handleGetTasksError(data.error));
  }
}

function* markUpToDateFromTasks( {cardId} ) {
  try {
    yield call(doPost, '/cards/uptodate', { cardId });
    yield put(handleMarkUpToDateFromTasksSuccess());
  } catch(error) {
    const { response: { date } } = error;
    yield put(handleMarkUpToDateFromTasksError(data.error));
  }
}
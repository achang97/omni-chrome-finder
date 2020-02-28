import { all, spawn } from 'redux-saga/effects';
import watchAuthRequests from './auth';
import watchSearchRequests from './search';
import watchAskRequests from './ask';
import watchCardsRequests from './cards';
import watchProfileRequests from './profile';
import watchTasksRequests from './tasks';

export default function* rootSaga(dispatch, getState) {
  yield all([
    watchAuthRequests(),
    watchSearchRequests(),
    watchAskRequests(),
    watchCardsRequests(),
    watchProfileRequests(),
    watchTasksRequests(),
  ]);
}

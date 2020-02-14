import { all, spawn } from 'redux-saga/effects';
import watchAuthRequests from './auth';
import watchSearchRequests from './search';
import watchAskRequests from './ask';

export default function* rootSaga(dispatch, getState) {
  yield all([
    watchAuthRequests(),
    watchSearchRequests(),
    watchAskRequests(),
  ]);
}

import { all, spawn } from 'redux-saga/effects';
import watchAuthRequests from './auth';
import watchSearchRequests from './search';

export default function* rootSaga(dispatch, getState) {
  yield all([
    watchAuthRequests(),
    watchSearchRequests(),
  ]);
}

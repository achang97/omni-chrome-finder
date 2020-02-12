import { all, spawn } from 'redux-saga/effects';
import watchAuthRequests from './auth';

export default function* rootSaga(dispatch, getState) {
  yield all([
    watchAuthRequests(),
  ]);
}

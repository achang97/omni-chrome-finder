import { all, spawn } from 'redux-saga/effects';
import watchDisplayRequests from './display';

export default function* rootSaga(dispatch, getState) {
  yield all([
    watchDisplayRequests(),
  ]);
}

import { all, spawn } from 'redux-saga/effects'
import watchCardRequests from './cards'

export default function* rootSaga(dispatch, getState) {
  yield all([
    watchCardRequests(),
  ])
}
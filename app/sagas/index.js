import { all } from 'redux-saga/effects';
import watchRequests from './requests';
import watchGeneral from './general';

export default function* rootSaga() {
  yield all([watchRequests(), watchGeneral()]);
}

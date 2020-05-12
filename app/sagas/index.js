import { all } from 'redux-saga/effects';
import watchAuthRequests from './auth';
import watchSearchRequests from './search';
import watchAskRequests from './ask';
import watchCreateRequests from './create';
import watchCardsRequests from './cards';
import watchFinderRequests from './finder';
import watchProfileRequests from './profile';
import watchTasksRequests from './tasks';
import watchAuditLogRequests from './auditLog';

export default function* rootSaga() {
  yield all([
    watchAuthRequests(),
    watchSearchRequests(),
    watchAskRequests(),
    watchCreateRequests(),
    watchCardsRequests(),
    watchFinderRequests(),
    watchProfileRequests(),
    watchTasksRequests(),
    watchAuditLogRequests()
  ]);
}

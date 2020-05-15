import { all } from 'redux-saga/effects';
import watchAuthRequests from './auth';
import watchSearchRequests from './search';
import watchAskRequests from './ask';
import watchCreateRequests from './create';
import watchCardsRequests from './cards';
import watchProfileRequests from './profile';
import watchTasksRequests from './tasks';
import watchNavigateRequests from './navigate';
import watchAuditLogRequests from './auditLog';
import watchAnalyticsRequests from './analytics';

export default function* rootSaga() {
  yield all([
    watchAuthRequests(),
    watchSearchRequests(),
    watchAskRequests(),
    watchCreateRequests(),
    watchCardsRequests(),
    watchProfileRequests(),
    watchTasksRequests(),
    watchNavigateRequests(),
    watchAuditLogRequests(),
    watchAnalyticsRequests()
  ]);
}

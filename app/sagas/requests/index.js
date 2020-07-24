import { all } from 'redux-saga/effects';
import watchAuthRequests from './auth';
import watchSearchRequests from './search';
import watchAskRequests from './ask';
import watchCardsRequests from './cards';
import watchFinderRequests from './finder';
import watchProfileRequests from './profile';
import watchTasksRequests from './tasks';
import watchAuditLogRequests from './auditLog';
import watchAnalyticsRequests from './analytics';
import watchExternalVerificationRequests from './externalVerification';

export default function* requestSaga() {
  yield all([
    watchAuthRequests(),
    watchSearchRequests(),
    watchAskRequests(),
    watchCardsRequests(),
    watchFinderRequests(),
    watchProfileRequests(),
    watchTasksRequests(),
    watchAuditLogRequests(),
    watchAnalyticsRequests(),
    watchExternalVerificationRequests()
  ]);
}

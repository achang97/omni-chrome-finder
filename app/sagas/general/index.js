import { all } from 'redux-saga/effects';
import watchAnalyticsActions from './analytics';
import watchAuthActions from './auth';
import watchCardActions from './cards';
import watchScreenRecordingActions from './screenRecording';
import watchSearchActions from './search';
import watchTasksActions from './tasks';
import watchAuditLogActions from './auditLog';

export default function* generalSaga() {
  yield all([
    watchAnalyticsActions(),
    watchAuthActions(),
    watchCardActions(),
    watchScreenRecordingActions(),
    watchSearchActions(),
    watchTasksActions(),
    watchAuditLogActions()
  ]);
}

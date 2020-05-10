import { take, call, fork, put } from 'redux-saga/effects';
import { doPost, getErrorMessage } from 'utils/request';
import { LOG_AUDIT_REQUEST } from 'actions/actionTypes';
import { handleLogAuditSuccess, handleLogAuditError } from 'actions/auditLog';

export default function* watchAuditLogRequests() {
  while (true) {
    const action = yield take([LOG_AUDIT_REQUEST]);

    const { type, payload } = action;
    switch (type) {
      case LOG_AUDIT_REQUEST: {
        yield fork(logAudit, payload);
        break;
      }
      default: {
        break;
      }
    }
  }
}

function* logAudit({ type, data }) {
  try {
    yield call(doPost, '/auditLogs', { type, data });
    yield put(handleLogAuditSuccess());
  } catch (error) {
    yield put(handleLogAuditError(getErrorMessage(error)));
  }
}

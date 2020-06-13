import { take, put, select } from 'redux-saga/effects';
import { TOGGLE_DOCK } from 'actions/actionTypes';
import { requestLogAudit } from 'actions/auditLog';
import { AUDIT_TYPE } from 'appConstants/profile';

export default function* watchAuditLogActions() {
  while (true) {
    const action = yield take([TOGGLE_DOCK]);

    const isLoggedIn = yield select((state) => state.auth.token);
    if (isLoggedIn) {
      const { type } = action;
      switch (type) {
        case TOGGLE_DOCK: {
          const dockVisible = yield select((state) => state.display.dockVisible);
          if (dockVisible) {
            yield put(requestLogAudit(AUDIT_TYPE.OPEN_EXTENSION, {}));
          }
          break;
        }
        default: {
          break;
        }
      }
    }
  }
}

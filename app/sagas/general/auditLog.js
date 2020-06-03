import { take, put, select } from 'redux-saga/effects';
import { CREATE_CARD_SUCCESS, TOGGLE_DOCK } from 'actions/actionTypes';
import { requestLogAudit } from 'actions/auditLog';
import { AUDIT_TYPE } from 'appConstants/profile';

export default function* watchAuditLogActions() {
  while (true) {
    const action = yield take([TOGGLE_DOCK, CREATE_CARD_SUCCESS]);

    const isLoggedIn = yield select((state) => state.auth.token);
    if (isLoggedIn) {
      const { type, payload } = action;
      switch (type) {
        case TOGGLE_DOCK: {
          const dockVisible = yield select((state) => state.display.dockVisible);
          if (dockVisible) {
            yield put(requestLogAudit(AUDIT_TYPE.OPEN_EXTENSION, {}));
          }
          break;
        }
        case CREATE_CARD_SUCCESS: {
          const { card } = payload;
          yield put(requestLogAudit(AUDIT_TYPE.CREATE_CARD_EXTENSION, { cardId: card._id }));
          break;
        }
        default: {
          break;
        }
      }
    }
  }
}

import { take, put } from 'redux-saga/effects';
import { CREATE_CARD_SUCCESS } from 'actions/actionTypes';
import { requestLogAudit } from 'actions/auditLog';
import { AUDIT_TYPE } from 'appConstants/profile';

export default function* watchAuditLogActions() {
  while (true) {
    const action = yield take([CREATE_CARD_SUCCESS]);

    const { type, payload } = action;
    switch (type) {
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

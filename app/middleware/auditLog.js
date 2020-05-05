import * as types from 'actions/actionTypes';
import { requestLogAudit } from 'actions/auditLog';
import { AUDIT_TYPE } from 'appConstants/profile';

const auditLogMiddleware = store => next => (action) => {
  const nextAction = next(action);
  const { type, payload } = action;

  switch (type) {
    case types.CREATE_CARD_SUCCESS: {
      const { card } = payload;
      store.dispatch(requestLogAudit(AUDIT_TYPE.CREATE_CARD_EXTENSION, { cardId: card._id }));
      break;
    }
    default: {
      break;
    }
  }

  return nextAction;
};

export default auditLogMiddleware;
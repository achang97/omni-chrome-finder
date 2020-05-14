import * as types from './actionTypes';

export function requestLogAudit(type, data) {
  return { type: types.LOG_AUDIT_REQUEST, payload: { type, data } };
}

export function handleLogAuditSuccess() {
  return { type: types.LOG_AUDIT_SUCCESS, payload: {} };
}

export function handleLogAuditError(error) {
  return { type: types.LOG_AUDIT_ERROR, payload: { error } };
}

import _ from 'lodash';
import * as types from 'actions/actionTypes';

export const initialState = {};

export default function auditLogReducer(state = initialState, action) {
  const { type, payload = {} } = action;

  switch (type) {
    case types.LOG_AUDIT_REQUEST: {
      return { isLoggingAudit: true, auditLogError: null };
    }
    case types.LOG_AUDIT_SUCCESS: {
      return { isLoggingAudit: false };
    }
    case types.LOG_AUDIT_ERROR: {
      const { error } = payload;
      return { isLoggingAudit: false, auditLogError: error };
    }
    default:
      return state;
  }
}

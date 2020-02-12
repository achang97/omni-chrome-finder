import * as types from './actionTypes';

/* Create behavior */
export function updateNavigateTab(tabIndex) {
  return { type: types.UPDATE_NAVIGATE_TAB, payload: { tabIndex } };
}

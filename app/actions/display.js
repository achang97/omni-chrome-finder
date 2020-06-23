import * as types from './actionTypes';

/* Dock behavior */
export function toggleDock() {
  return { type: types.TOGGLE_DOCK, payload: {} };
}

export function hideToggleTab() {
  return { type: types.HIDE_TOGGLE_TAB, payload: {} };
}

export function minimizeDock() {
  return { type: types.MINIMIZE_DOCK, payload: {} };
}

export function toggleAutofindTab() {
  return { type: types.TOGGLE_AUTOFIND_TAB, payload: {} };
}

export function openModal(modalProps) {
  return { type: types.OPEN_MODAL, payload: { modalProps } };
}

export function closeModal() {
  return { type: types.CLOSE_MODAL, payload: {} };
}

export function updateToggleTabPosition(newY) {
  return { type: types.UPDATE_TOGGLE_TAB_POSITION, payload: { newY } };
}

export function toggleSearchBar() {
  return { type: types.TOGGLE_SEARCH_BAR, payload: {} };
}

export function minimizeSearchBar() {
  return { type: types.MINIMIZE_SEARCH_BAR, payload: {} };
}

export function updateWindowUrl(url) {
  return { type: types.UPDATE_WINDOW_URL, payload: { url } };
}

import * as types from './actionTypes';

/* Dock behavior */
export function toggleDock() {
  return { type: types.TOGGLE_DOCK, payload: {} };
}

export function toggleDockHeight() {
  return { type: types.TOGGLE_DOCK_HEIGHT, payload: {} };
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

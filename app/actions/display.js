import * as types from './actionTypes';

/* Dock behavior */
export function toggleDock() {
  return { type: types.TOGGLE_DOCK, payload: {} };
}

export function expandDock() {
  return { type: types.EXPAND_DOCK, payload: {} };
}

export function openModal(modalProps) {
  return { type: types.OPEN_MODAL, payload: { modalProps } };
}

export function closeModal() {
  return { type: types.CLOSE_MODAL, payload: {} };
}
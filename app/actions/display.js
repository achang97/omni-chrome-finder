import * as types from './actionTypes';

/* Dock behavior */
export function toggleDock() {
  return { type: types.TOGGLE_DOCK, payload: {} };
}

export function expandDock() {
  return { type: types.EXPAND_DOCK, payload: {} };
}


import * as types from './actionTypes';

/* Dock behavior */
export function toggleDock() {
  return { type: types.TOGGLE_DOCK, payload: { } };
}

/* Card behavior */
export function openCard(id) {
  return { type: types.OPEN_CARD, payload: { id } };
}

export function setActiveCardIndex(index) {
  return { type: types.SET_ACTIVE_CARD_INDEX, payload: { index } };
}

export function closeCard(id) {
  return { type: types.CLOSE_CARD, payload: { id } };
}

export function closeAllCards() {
  return { type: types.CLOSE_ALL_CARDS, payload: { } };
}
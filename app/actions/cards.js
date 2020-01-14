import * as types from './actionTypes';

/* Card behavior */
export function openCard(id) {
  return { type: types.OPEN_CARD, payload: { id } };
}

export function closeCard(id) {
  return { type: types.CLOSE_CARD, payload: { id } };
}
import * as types from './actionTypes';

export function requestSearchCards(type, query) {
  return { type: types.SEARCH_CARDS_REQUEST, payload: { type, query } };
}

export function handleSearchCardsSuccess(type, cards) {
  return { type: types.SEARCH_CARDS_SUCCESS, payload: { type, cards } };
}

export function handleSearchCardsError(type, error) {
  return { type: types.SEARCH_CARDS_ERROR, payload: { type, error } };
}

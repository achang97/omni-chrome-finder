import * as types from './actionTypes';

export function requestCardSearch(type, query) {
  return { type: types.SEARCH_CARDS_REQUEST, payload: { type, query } };
}

export function handleCardSearchSuccess(type, cards) {
  return { type: types.SEARCH_CARDS_SUCCESS, payload: { type, cards } };
}

export function handleCardSearchError(type, error) {
  return { type: types.SEARCH_CARDS_ERROR, payload: { type, error } };
}

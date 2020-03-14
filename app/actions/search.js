import * as types from './actionTypes';

export function requestSearchCards(type, query, clearCards = false) {
  return { type: types.SEARCH_CARDS_REQUEST, payload: { type, query, clearCards } };
}

export function handleSearchCardsSuccess(type, cards, externalResults, clearCards) {
  return {
    type: types.SEARCH_CARDS_SUCCESS,
    payload: { type, cards, externalResults, clearCards }
  };
}

export function handleSearchCardsError(type, error) {
  return { type: types.SEARCH_CARDS_ERROR, payload: { type, error } };
}

export function clearSearchCards(type) {
  return { type: types.CLEAR_SEARCH_CARDS, payload: { type } };
}


export function addSearchCard(card) {
  return { type: types.ADD_SEARCH_CARD, payload: { card } };
}

export function updateSearchCard(card) {
  return { type: types.UPDATE_SEARCH_CARD, payload: { card } };
}

export function removeSearchCard(cardId) {
  return { type: types.REMOVE_SEARCH_CARD, payload: { cardId } };
}


export function requestSearchTags(name) {
  return { type: types.SEARCH_TAGS_REQUEST, payload: { name } };
}

export function handleSearchTagsSuccess(tags) {
  return { type: types.SEARCH_TAGS_SUCCESS, payload: { tags } };
}

export function handleSearchTagsError(error) {
  return { type: types.SEARCH_CARDS_ERROR, payload: { error } };
}

export function requestSearchUsers(name) {
  return { type: types.SEARCH_USERS_REQUEST, payload: { name } };
}

export function handleSearchUsersSuccess(users) {
  return { type: types.SEARCH_USERS_SUCCESS, payload: { users } };
}

export function handleSearchUsersError(error) {
  return { type: types.SEARCH_USERS_ERROR, payload: { error } };
}

export function requestSearchPermissionGroups(name) {
  return { type: types.SEARCH_PERMISSION_GROUPS_REQUEST, payload: { name } };
}

export function handleSearchPermissionGroupsSuccess(permissionGroups) {
  return { type: types.SEARCH_PERMISSION_GROUPS_SUCCESS, payload: { permissionGroups } };
}

export function handleSearchPermissionGroupsError(error) {
  return { type: types.SEARCH_PERMISSION_GROUPS_ERROR, payload: { error } };
}

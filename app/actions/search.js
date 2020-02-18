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
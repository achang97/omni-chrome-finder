import * as types from './actionTypes';

export function requestSearchCards(source, query, clearCards = false) {
  return { type: types.SEARCH_CARDS_REQUEST, payload: { source, query, clearCards } };
}

export function handleSearchCardsSuccess(source, cards, searchLogId, clearCards) {
  return { type: types.SEARCH_CARDS_SUCCESS, payload: { source, cards, searchLogId, clearCards } };
}

export function handleSearchCardsError(source, error) {
  return { type: types.SEARCH_CARDS_ERROR, payload: { source, error } };
}

export function clearSearchCards(source) {
  return { type: types.CLEAR_SEARCH_CARDS, payload: { source } };
}

export function updateSearchCard(card) {
  return { type: types.UPDATE_SEARCH_CARD, payload: { card } };
}

export function removeSearchCards(cardIds) {
  return { type: types.REMOVE_SEARCH_CARDS, payload: { cardIds } };
}

export function requestSearchNodes(query) {
  return { type: types.SEARCH_NODES_REQUEST, payload: { query } };
}

export function handleSearchNodesSuccess(nodes, searchLogId) {
  return { type: types.SEARCH_NODES_SUCCESS, payload: { nodes, searchLogId } };
}

export function handleSearchNodesError(error) {
  return { type: types.SEARCH_NODES_ERROR, payload: { error } };
}

export function updateSearchNode(node) {
  return { type: types.UPDATE_SEARCH_NODE, payload: { node } };
}

export function removeSearchNodes(nodeIds) {
  return { type: types.REMOVE_SEARCH_NODES, payload: { nodeIds } };
}

export function requestSearchIntegrations(query) {
  return { type: types.SEARCH_INTEGRATIONS_REQUEST, payload: { query } };
}

export function handleSearchIndividualIntegrationSuccess(integration, items) {
  return { type: types.SEARCH_INDIVIDUAL_INTEGRATION_SUCCESS, payload: { integration, items } };
}

export function handleSearchIntegrationsSuccess() {
  return { type: types.SEARCH_INTEGRATIONS_SUCCESS, payload: {} };
}

export function handleSearchIntegrationsError(error) {
  return { type: types.SEARCH_INTEGRATIONS_ERROR, payload: { error } };
}

export function updateSearchIntegrationResult(integration, matchParams, update) {
  return {
    type: types.UPDATE_SEARCH_INTEGRATION_RESULT,
    payload: { integration, matchParams, update }
  };
}

export function requestSearchTags(name) {
  return { type: types.SEARCH_TAGS_REQUEST, payload: { name } };
}

export function handleSearchTagsSuccess(tags) {
  return { type: types.SEARCH_TAGS_SUCCESS, payload: { tags } };
}

export function handleSearchTagsError(error) {
  return { type: types.SEARCH_TAGS_ERROR, payload: { error } };
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

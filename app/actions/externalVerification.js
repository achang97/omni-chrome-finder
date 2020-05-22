import * as types from './actionTypes';

export function resetExternalState() {
  return { type: types.RESET_EXTERNAL_STATE, payload: {} };
}

export function updateExternalVerificationInterval(interval) {
  return { type: types.UPDATE_EXTERNAL_VERIFICATION_INTERVAL, payload: { interval } };
}

export function addExternalOwner(owner) {
  return { type: types.ADD_EXTERNAL_OWNER, payload: { owner } };
}

export function removeExternalOwner(owner) {
  return { type: types.REMOVE_EXTERNAL_OWNER, payload: { owner } };
}

export function updateExternalFinderNode(finderNode) {
  return { type: types.UPDATE_EXTERNAL_FINDER_NODE, payload: { finderNode } };
}

export function toggleExternalModal() {
  return { type: types.TOGGLE_EXTERNAL_MODAL, payload: {} };
}

export function toggleExternalDisplay() {
  return { type: types.TOGGLE_EXTERNAL_DISPLAY, payload: {} };
}

export function updateExternalIntegration(integration) {
  return { type: types.UPDATE_EXTERNAL_INTEGRATION, payload: { integration } };
}

export function requestGetExternalCard(link) {
  return { type: types.GET_EXTERNAL_CARD_REQUEST, payload: { link } };
}

export function handleGetExternalCardSuccess(card) {
  return { type: types.GET_EXTERNAL_CARD_SUCCESS, payload: { card } };
}

export function handleGetExternalCardError(error) {
  return { type: types.GET_EXTERNAL_CARD_ERROR, payload: { error } };
}

export function requestCreateExternalCard(title, externalLinkAnswer) {
  return { type: types.CREATE_EXTERNAL_CARD_REQUEST, payload: { title, externalLinkAnswer } };
}

export function handleCreateExternalCardSuccess(card) {
  return { type: types.CREATE_EXTERNAL_CARD_SUCCESS, payload: { card } };
}

export function handleCreateExternalCardError(error) {
  return { type: types.CREATE_EXTERNAL_CARD_ERROR, payload: { error } };
}

import * as types from './actionTypes';

/* Card behavior */
export function openCard(card, createModalOpen=false, isNewCard=false) {
  return { type: types.OPEN_CARD, payload: { card, isNewCard, createModalOpen } };
}

export function setActiveCardIndex(index) {
  return { type: types.SET_ACTIVE_CARD_INDEX, payload: { index } };
}

export function closeCard(index) {
  return { type: types.CLOSE_CARD, payload: { index } };
}

export function closeAllCards() {
  return { type: types.CLOSE_ALL_CARDS, payload: {} };
}

export function openModal() {
  return { type: types.OPEN_MODAL, payload: {} };
}

export function closeModal() {
  return { type: types.CLOSE_MODAL, payload: {} };
}

export function adjustCardsDimensions(newWidth, newHeight) {
  return { type: types.ADJUST_CARDS_DIMENSIONS, payload: { newWidth, newHeight } }
}

export function updateCardQuestion(question) {
  return { type: types.UPDATE_CARD_QUESTION, payload: { question } };
}

export function updateCardAnswerEditor(editorState) {
  return { type: types.UPDATE_CARD_ANSWER_EDITOR, payload: { editorState } };
}

export function updateCardDescriptionEditor(editorState) {
  return { type: types.UPDATE_CARD_DESCRIPTION_EDITOR, payload: { editorState } };
}

export function updateCardStatus(cardStatus) {
  return { type: types.UPDATE_CARD_STATUS, payload: { cardStatus } };
}

export function enableCardEditor(editorType) {
  return { type: types.ENABLE_CARD_EDITOR, payload: { editorType} };
}

export function disableCardEditor(editorType) {
  return { type: types.DISABLE_CARD_EDITOR, payload: { editorType} };
}

export function adjustCardDescriptionSectionHeight(newHeight) {
  return { type: types.ADJUST_CARD_DESCRIPTION_SECTION_HEIGHT, payload: { newHeight} };
}

export function toggleCardSelectedMessage(messageIndex) {
  return { type: types.TOGGLE_CARD_SELECTED_MESSAGE, payload: { messageIndex } };
}

export function cancelEditCardMessages() {
  return { type: types.CANCEL_EDIT_CARD_MESSAGES, payload: {} };
}

export function addCardAttachments(attachments) {
  return { type: types.ADD_CARD_ATTACHMENTS, payload: { attachments } };
}

export function removeCardAttachment(index) {
  return { type: types.REMOVE_CARD_ATTACHMENT, payload: { index } };
}

export function addCardOwner(owner) {
  return { type: types.ADD_CARD_OWNER, payload: { owner } };
}

export function removeCardOwner(index) {
  return { type: types.REMOVE_CARD_OWNER, payload: { index } };
}

export function updateCardTags(tags) {
  return { type: types.UPDATE_CARD_TAGS, payload: { tags } };
}

export function removeCardTag(index) {
  return { type: types.REMOVE_CARD_TAG, payload: { index } };
}

export function updateCardKeywords(keywords) {
  return { type: types.UPDATE_CARD_KEYWORDS, payload: { keywords } };
}

export function updateCardVerificationInterval(verificationInterval) {
  return { type: types.UPDATE_CARD_VERIFICATION_INTERVAL, payload: { verificationInterval } };
}

export function updateCardPermissions(permissions) {
  return { type: types.UPDATE_CARD_PERMISSIONS, payload: { permissions } };
}

export function updateCardPermissionGroups(permissionGroups) {
  return { type: types.UPDATE_CARD_PERMISSION_GROUPS, payload: { permissionGroups } };
}

export function openCardModal(modalType) {
  return { type: types.OPEN_CARD_MODAL, payload: { modalType } };
}

export function closeCardModal(modalType) {
  return { type: types.CLOSE_CARD_MODAL, payload: { modalType } };
}

export function editCard() {
  return { type: types.EDIT_CARD, payload: { } };
}

export function cancelEditCard() {
  return { type: types.CANCEL_EDIT_CARD, payload: {} }
}

export function saveCard() {
  return { type: types.SAVE_CARD, payload: { } };
}

export function openCardSideDock() {
  return { type: types.OPEN_CARD_SIDE_DOCK, payload: { } };
}

export function closeCardSideDock() {
  return { type: types.CLOSE_CARD_SIDE_DOCK, payload: { } };
}


export function requestCreateCard() {
  return { type: types.CREATE_CARD_REQUEST, payload: {} };
}

export function handleCreateCardSuccess() {
  return { type: types.CREATE_CARD_SUCCESS, payload: {} };
}

export function handleCreateCardError(error) {
  return { type: types.CREATE_CARD_ERROR, payload: { error } };
}

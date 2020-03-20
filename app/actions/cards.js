import * as types from './actionTypes';

/* Card behavior */
export function openCard(card, createModalOpen = false, isNewCard = false) {
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
  return { type: types.ADJUST_CARDS_DIMENSIONS, payload: { newWidth, newHeight } };
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

export function enableCardEditor(editorType) {
  return { type: types.ENABLE_CARD_EDITOR, payload: { editorType } };
}

export function disableCardEditor(editorType) {
  return { type: types.DISABLE_CARD_EDITOR, payload: { editorType } };
}

export function adjustCardDescriptionSectionHeight(newHeight) {
  return { type: types.ADJUST_CARD_DESCRIPTION_SECTION_HEIGHT, payload: { newHeight } };
}

export function toggleCardSelectedMessage(messageIndex) {
  return { type: types.TOGGLE_CARD_SELECTED_MESSAGE, payload: { messageIndex } };
}

export function cancelEditCardMessages() {
  return { type: types.CANCEL_EDIT_CARD_MESSAGES, payload: {} };
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
  return { type: types.CANCEL_EDIT_CARD, payload: {} };
}

export function openCardSideDock() {
  return { type: types.OPEN_CARD_SIDE_DOCK, payload: { } };
}

export function closeCardSideDock() {
  return { type: types.CLOSE_CARD_SIDE_DOCK, payload: { } };
}

export function updateOutOfDateReason(reason) {
  return { type: types.UPDATE_OUT_OF_DATE_REASON, payload: { reason } };
}

/* API REQUESTS */
export function requestAddCardAttachment(key, file) {
  return { type: types.ADD_CARD_ATTACHMENT_REQUEST, payload: { key, file } };
}

export function handleAddCardAttachmentSuccess(cardId, key, attachment) {
  return { type: types.ADD_CARD_ATTACHMENT_SUCCESS, payload: { cardId, key, attachment } };
}

export function handleAddCardAttachmentError(cardId, key, error) {
  return { type: types.ADD_CARD_ATTACHMENT_ERROR, payload: { cardId, key, error } };
}


export function removeCardAttachment(index) {
  return { type: types.REMOVE_CARD_ATTACHMENT, payload: { index } };
}

export function updateCardAttachmentName(index, name) {
  return { type: types.UPDATE_CARD_ATTACHMENT_NAME, payload: { index, name } };
}


export function requestGetCard() {
  return { type: types.GET_CARD_REQUEST, payload: {} };
}

export function handleGetCardSuccess(cardId, card) {
  return { type: types.GET_CARD_SUCCESS, payload: { cardId, card } };
}

export function handleGetCardError(cardId, error) {
  return { type: types.GET_CARD_ERROR, payload: { cardId, error } };
}


export function requestCreateCard() {
  return { type: types.CREATE_CARD_REQUEST, payload: {} };
}

export function handleCreateCardSuccess(cardId, card) {
  return { type: types.CREATE_CARD_SUCCESS, payload: { cardId, card } };
}

export function handleCreateCardError(cardId, error) {
  return { type: types.CREATE_CARD_ERROR, payload: { cardId, error } };
}


export function requestUpdateCard(payload) {
  payload = { isUndocumented: false, closeCard: false, ...payload };
  return { type: types.UPDATE_CARD_REQUEST, payload };
}

export function handleUpdateCardSuccess(card, closeCard) {
  return { type: types.UPDATE_CARD_SUCCESS, payload: { closeCard, card } };
}

export function handleUpdateCardError(cardId, error, closeCard) {
  return { type: types.UPDATE_CARD_ERROR, payload: { cardId, error, closeCard } };
}


export function requestDeleteCard() {
  return { type: types.DELETE_CARD_REQUEST, payload: {} };
}

export function handleDeleteCardSuccess(cardId) {
  return { type: types.DELETE_CARD_SUCCESS, payload: { cardId } };
}

export function handleDeleteCardError(cardId, error) {
  return { type: types.DELETE_CARD_ERROR, payload: { cardId, error } };
}


export function requestToggleUpvote(upvotes) {
  return { type: types.TOGGLE_UPVOTE_REQUEST, payload: { upvotes } };
}

export function handleToggleUpvoteSuccess(card) {
  return { type: types.TOGGLE_UPVOTE_SUCCESS, payload: { card } };
}

export function handleToggleUpvoteError(cardId, error, oldUpvotes) {
  return { type: types.TOGGLE_UPVOTE_ERROR, payload: { cardId, error, oldUpvotes } };
}


export function requestMarkUpToDate() {
  return { type: types.MARK_UP_TO_DATE_REQUEST, payload: { } };
}

export function handleMarkUpToDateSuccess(card) {
  return { type: types.MARK_UP_TO_DATE_SUCCESS, payload: { card } };
}

export function handleMarkUpToDateError(cardId, error) {
  return { type: types.MARK_UP_TO_DATE_ERROR, payload: { cardId, error } };
}


export function requestMarkOutOfDate() {
  return { type: types.MARK_OUT_OF_DATE_REQUEST, payload: { } };
}

export function handleMarkOutOfDateSuccess(card) {
  return { type: types.MARK_OUT_OF_DATE_SUCCESS, payload: { card } };
}

export function handleMarkOutOfDateError(cardId, error) {
  return { type: types.MARK_OUT_OF_DATE_ERROR, payload: { cardId, error } };
}


export function requestApproveCard() {
  return { type: types.APPROVE_CARD_REQUEST, payload: { } };
}

export function handleApproveCardSuccess(card) {
  return { type: types.APPROVE_CARD_SUCCESS, payload: { card } };
}

export function handleApproveCardError(cardId, error) {
  return { type: types.APPROVE_CARD_ERROR, payload: { cardId, error } };
}



export function requestAddBookmark(cardId) {
  return { type: types.ADD_BOOKMARK_REQUEST, payload: { cardId } };
}

export function handleAddBookmarkSuccess(cardId, card) {
  return { type: types.ADD_BOOKMARK_SUCCESS, payload: { cardId, card } };
}

export function handleAddBookmarkError(cardId, error) {
  return { type: types.ADD_BOOKMARK_ERROR, payload: { cardId, error } };
}


export function requestRemoveBookmark(cardId) {
  return { type: types.REMOVE_BOOKMARK_REQUEST, payload: { cardId } };
}

export function handleRemoveBookmarkSuccess(cardId) {
  return { type: types.REMOVE_BOOKMARK_SUCCESS, payload: { cardId } };
}

export function handleRemoveBookmarkError(cardId, error) {
  return { type: types.REMOVE_BOOKMARK_ERROR, payload: { cardId, error } };
}


import * as types from './actionTypes';

/* Card positioning */
export function updateCardWindowPosition(position) {
  return { type: types.UPDATE_CARD_WINDOW_POSITION, payload: { position } };
}

export function adjustCardsDimensions(newWidth, newHeight) {
  return { type: types.ADJUST_CARDS_DIMENSIONS, payload: { newWidth, newHeight } };
}

export function updateCardTabOrder(source, destination) {
  return { type: types.UPDATE_CARD_TAB_ORDER, payload: { source, destination } };
}

export function toggleCards() {
  return { type: types.TOGGLE_CARDS, payload: {} };
}

/* Card behavior */
export function openCard(card, isNewCard = false, createModalOpen = false) {
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

export function openCardContainerModal() {
  return { type: types.OPEN_CARD_CONTAINER_MODAL, payload: {} };
}

export function closeCardContainerModal() {
  return { type: types.CLOSE_CARD_CONTAINER_MODAL, payload: {} };
}

export function updateCardQuestion(question) {
  return { type: types.UPDATE_CARD_QUESTION, payload: { question } };
}

export function updateCardAnswerEditor(editorState) {
  return { type: types.UPDATE_CARD_ANSWER_EDITOR, payload: { editorState } };
}

export function updateCardSelectedThreadIndex(index) {
  return { type: types.UPDATE_CARD_SELECTED_THREAD, payload: { index } };
}

export function toggleCardSelectedMessage(messageIndex) {
  return { type: types.TOGGLE_CARD_SELECTED_MESSAGE, payload: { messageIndex } };
}

export function cancelEditCardMessages() {
  return { type: types.CANCEL_EDIT_CARD_MESSAGES, payload: {} };
}

export function updateCardFinderNode(finderNode) {
  return { type: types.UPDATE_CARD_FINDER_NODE, payload: { finderNode } };
}

export function addCardOwner(owner) {
  return { type: types.ADD_CARD_OWNER, payload: { owner } };
}

export function removeCardOwner(index) {
  return { type: types.REMOVE_CARD_OWNER, payload: { index } };
}

export function addCardSubscriber(subscriber) {
  return { type: types.ADD_CARD_SUBSCRIBER, payload: { subscriber } };
}

export function removeCardSubscriber(index) {
  return { type: types.REMOVE_CARD_SUBSCRIBER, payload: { index } };
}

export function updateCardTags(tags) {
  return { type: types.UPDATE_CARD_TAGS, payload: { tags } };
}

export function removeCardTag(index) {
  return { type: types.REMOVE_CARD_TAG, payload: { index } };
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
  return { type: types.EDIT_CARD, payload: {} };
}

export function cancelEditCard() {
  return { type: types.CANCEL_EDIT_CARD, payload: {} };
}

export function openCardSideDock() {
  return { type: types.OPEN_CARD_SIDE_DOCK, payload: {} };
}

export function closeCardSideDock() {
  return { type: types.CLOSE_CARD_SIDE_DOCK, payload: {} };
}

export function updateOutOfDateReason(reason) {
  return { type: types.UPDATE_OUT_OF_DATE_REASON, payload: { reason } };
}

export function updateCard(card) {
  return { type: types.UPDATE_CARD, payload: { card } };
}

/* API REQUESTS */
export function requestAddCardAttachment(cardId, key, file) {
  return { type: types.ADD_CARD_ATTACHMENT_REQUEST, payload: { cardId, key, file } };
}

export function handleAddCardAttachmentSuccess(cardId, key, attachment) {
  return { type: types.ADD_CARD_ATTACHMENT_SUCCESS, payload: { cardId, key, attachment } };
}

export function handleAddCardAttachmentError(cardId, key, error) {
  return { type: types.ADD_CARD_ATTACHMENT_ERROR, payload: { cardId, key, error } };
}

export function removeCardAttachment(key) {
  return { type: types.REMOVE_CARD_ATTACHMENT, payload: { key } };
}

export function updateCardAttachmentName(key, name) {
  return { type: types.UPDATE_CARD_ATTACHMENT_NAME, payload: { key, name } };
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

export function requestUpdateCard(shouldCloseCard = false) {
  return { type: types.UPDATE_CARD_REQUEST, payload: { shouldCloseCard } };
}

export function handleUpdateCardSuccess(card, shouldCloseCard, isApprover) {
  return { type: types.UPDATE_CARD_SUCCESS, payload: { shouldCloseCard, card, isApprover } };
}

export function handleUpdateCardError(cardId, error, shouldCloseCard) {
  return { type: types.UPDATE_CARD_ERROR, payload: { cardId, error, shouldCloseCard } };
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
  return { type: types.MARK_UP_TO_DATE_REQUEST, payload: {} };
}

export function handleMarkUpToDateSuccess(card) {
  return { type: types.MARK_UP_TO_DATE_SUCCESS, payload: { card } };
}

export function handleMarkUpToDateError(cardId, error) {
  return { type: types.MARK_UP_TO_DATE_ERROR, payload: { cardId, error } };
}

export function requestMarkOutOfDate() {
  return { type: types.MARK_OUT_OF_DATE_REQUEST, payload: {} };
}

export function handleMarkOutOfDateSuccess(card) {
  return { type: types.MARK_OUT_OF_DATE_SUCCESS, payload: { card } };
}

export function handleMarkOutOfDateError(cardId, error) {
  return { type: types.MARK_OUT_OF_DATE_ERROR, payload: { cardId, error } };
}

export function requestApproveCard() {
  return { type: types.APPROVE_CARD_REQUEST, payload: {} };
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

export function requestGetSlackThread() {
  return { type: types.GET_SLACK_THREAD_REQUEST, payload: {} };
}

export function handleGetSlackThreadSuccess(cardId, slackReplies) {
  return { type: types.GET_SLACK_THREAD_SUCCESS, payload: { cardId, slackReplies } };
}

export function handleGetSlackThreadError(cardId, error) {
  return { type: types.GET_SLACK_THREAD_ERROR, payload: { cardId, error } };
}

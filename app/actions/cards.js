import * as types from './actionTypes';

/* Card behavior */
export function openCard({id, createModalOpen, descriptionEditorState, answerEditorState, fromCreate}) {
  return { type: types.OPEN_CARD, payload: { id, createModalOpen, descriptionEditorState, answerEditorState, fromCreate } };
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

export function adjustCardsDimensions(newWidth, newHeight) {
  return { type: types.ADJUST_CARDS_DIMENSIONS, payload: { newWidth, newHeight } }
}

export function changeQuestion(newValue) {
  return { type: types.CHANGE_QUESTION, payload: { newValue } };
}

export function changeAnswerEditor(editorState) {
  return { type: types.CHANGE_ANSWER_EDITOR, payload: { editorState } };
}

export function changeDescriptionEditor(editorState) {
  return { type: types.CHANGE_DESCRIPTION_EDITOR, payload: { editorState } };
}

export function changeCreateQuestion(newValue) {
  return { type: types.CHANGE_CREATE_QUESTION, payload: { newValue }};
}

export function changeCreateAnswerEditor(editorState) {
  return { type: types.CHANGE_CREATE_ANSWER_EDITOR, payload: { editorState } };
}

export function changeCreateDescriptionEditor(editorState) {
  return { type: types.CHANGE_CREATE_DESCRIPTION_EDITOR, payload: { editorState } };
}

export function clearCreatePanel() {
  return { type: types.CLEAR_CREATE_PANEL, payload: {} };
}

export function changeCardStatus(id, newStatus) {
  return { type: types.CHANGE_CARD_STATUS, payload: { id, newStatus } };
}

export function editCard() {
  return { type: types.EDIT_CARD, payload: { } };
}

export function enableEditor(editorType) {
  return { type: types.ENABLE_EDITOR, payload: { editorType} };
}

export function disableEditor(editorType) {
  return { type: types.DISABLE_EDITOR, payload: { editorType} };
}

export function adjustDescriptionSectionHeight(newHeight) {
  return { type: types.ADJUST_DESCRIPTION_SECTION_HEIGHT, payload: { newHeight} };
}

export function toggleSelectedMessage(messageIndex) {
  return { type: types.TOGGLE_SELECTED_MESSAGE, payload: { messageIndex } };
}

export function openModal(modalType) {
  return { type: types.OPEN_MODAL, payload: { modalType } };
}

export function closeModal(modalType) {
  return { type: types.CLOSE_MODAL, payload: { modalType } };
}

export function saveCard() {
  return { type: types.SAVE_CARD, payload: { } };
}

export function saveMessages() {
  return { type: types.SAVE_MESSAGES, payload: { } };
}

export function openCardSideDock() {
  return { type: types.OPEN_CARD_SIDE_DOCK, payload: { } };
}

export function closeCardSideDock() {
  return { type: types.CLOSE_CARD_SIDE_DOCK, payload: { } };
}

export function openCardCreateModal() {
  return { type: types.OPEN_CARD_CREATE_MODAL, payload: { } };
}

export function closeCardCreateModal() {
  return { type: types.CLOSE_CARD_CREATE_MODAL, payload: { } };
}

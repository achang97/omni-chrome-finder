import * as types from './actionTypes';

/* Card behavior */
export function openCard(id, question, descriptionEditorState, answerEditorState) {
  return { type: types.OPEN_CARD, payload: { id, question, descriptionEditorState, answerEditorState } };
}

export function setActiveCardIndex(index) {
  return { type: types.SET_ACTIVE_CARD_INDEX, payload: { index } };
}

export function closeCard(id) {
  return { type: types.CLOSE_CARD, payload: { id } };
}

export function closeAllCards() {
  return { type: types.CLOSE_ALL_CARDS, payload: {} };
}

export function adjustCardsDimensions(newWidth, newHeight) {
  return { type: types.ADJUST_CARDS_DIMENSIONS, payload: { newWidth, newHeight } }
}

export function changeAnswerEditor(id, editorState) {
  return { type: types.CHANGE_ANSWER_EDITOR, payload: { id, editorState } };
}

export function changeDescriptionEditor(id, editorState) {
  return { type: types.CHANGE_DESCRIPTION_EDITOR, payload: { id, editorState } };
}

export function editCard(id) {
  return { type: types.EDIT_CARD, payload: { id } };
}

export function enableEditor(id, editorType) {
  return { type: types.ENABLE_EDITOR, payload: { id, editorType} };
}

export function disableEditor(id, editorType) {
  return { type: types.DISABLE_EDITOR, payload: { id, editorType} };
}

export function adjustDescriptionSectionHeight(id, newHeight) {
  return { type: types.ADJUST_DESCRIPTION_SECTION_HEIGHT, payload: { id, newHeight} };
}

export function toggleSelectedMessage(id, messageIndex) {
  return { type: types.TOGGLE_SELECTED_MESSAGE, payload: { id, messageIndex } };
}

export function openModal(id, modalType) {
  return { type: types.OPEN_MODAL, payload: {id, modalType} };
}

export function closeModal(id, modalType) {
  return { type: types.CLOSE_MODAL, payload: {id, modalType} };
}

export function saveCard(id ) {
  return { type: types.SAVE_CARD, payload: { id } };
}

export function saveMessages(id ) {
  return { type: types.SAVE_MESSAGES, payload: { id } };
}

export function openCardSideDock(id) {
  return { type: types.OPEN_CARD_SIDE_DOCK, payload: { id } };
}

export function closeCardSideDock(id) {
  return { type: types.CLOSE_CARD_SIDE_DOCK, payload: { id } };
}

export function openCardCreateModal(id) {
  return { type: types.OPEN_CARD_CREATE_MODAL, payload: { id } };
}

export function closeCardCreateModal(id) {
  return { type: types.CLOSE_CARD_CREATE_MODAL, payload: { id } };
}

import * as types from './actionTypes';

/* Create behavior */
export function showCreateDescriptionEditor() {
  return { type: types.SHOW_CREATE_DESCRIPTION_EDITOR, payload: {} };
}

export function updateCreateQuestion(newValue) {
  return { type: types.UPDATE_CREATE_QUESTION, payload: { newValue } };
}

export function updateCreateAnswerEditor(editorState) {
  return { type: types.UPDATE_CREATE_ANSWER_EDITOR, payload: { editorState } };
}

export function updateCreateDescriptionEditor(editorState) {
  return { type: types.UPDATE_CREATE_DESCRIPTION_EDITOR, payload: { editorState } };
}

export function clearCreatePanel() {
  return { type: types.CLEAR_CREATE_PANEL, payload: {} };
}


export function requestAddCreateAttachment(key, file) {
  return { type: types.ADD_CREATE_ATTACHMENT_REQUEST, payload: { key, file } };
}

export function handleAddCreateAttachmentSuccess(key, attachment) {
  return { type: types.ADD_CREATE_ATTACHMENT_SUCCESS, payload: { key, attachment } };
}

export function handleAddCreateAttachmentError(key, error) {
  return { type: types.ADD_CREATE_ATTACHMENT_ERROR, payload: { key, error } };
}


export function requestRemoveCreateAttachment(key) {
  return { type: types.REMOVE_CREATE_ATTACHMENT_REQUEST, payload: { key } };
}

export function handleRemoveCreateAttachmentSuccess(key) {
  return { type: types.REMOVE_CREATE_ATTACHMENT_SUCCESS, payload: { key } };
}

export function handleRemoveCreateAttachmentError(key, error) {
  return { type: types.REMOVE_CREATE_ATTACHMENT_ERROR, payload: { key, error } };
}

export function updateCreateAttachmentName(key, name) {
  return { type: types.UPDATE_CREATE_ATTACHMENT_NAME, payload: { key, name } };
}
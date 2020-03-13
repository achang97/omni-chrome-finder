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

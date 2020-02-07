import * as types from './actionTypes';

export function updateAskSearchText(text) {
  return { type: types.UPDATE_ASK_SEARCH_TEXT, payload: { text } };
}

export function changeAskIntegration(integration) {
  return { type: types.CHANGE_ASK_INTEGRATION, payload: { integration } };
}

export function updateAskQuestionTitle(text) {
  return { type: types.UPDATE_ASK_QUESTION_TITLE, payload: { text } };
}

export function updateAskQuestionDescription(description) {
  return { type: types.UPDATE_ASK_QUESTION_DESCRIPTION, payload: { description } };
}

export function addAskRecipient(recipient) {
  return { type: types.ADD_ASK_RECIPIENT, payload: { recipient } };
}

export function removeAskRecipient(index) {
  return { type: types.REMOVE_ASK_RECIPIENT, payload: { index } };
}

export function updateAskRecipient(index, newInfo ) {
  return { type: types.UPDATE_ASK_RECIPIENT, payload: { index, newInfo } };
}

export function addAskScreenRecordingChunk(recordingChunk) {
  return { type: types.ADD_ASK_SCREEN_RECORDING_CHUNK, payload: { recordingChunk } };
}

export function startAskScreenRecording(stream, mediaRecorder) {
  return { type: types.START_ASK_SCREEN_RECORDING, payload: { stream, mediaRecorder } };
}

export function endAskScreenRecording(screenRecording) {
  return { type: types.END_ASK_SCREEN_RECORDING, payload: { screenRecording } };
}

export function askScreenRecordingError(error) {
  return { type: types.ASK_SCREEN_RECORDING_ERROR, payload: { error } }
}

export function addAskAttachments(attachments) {
  return { type: types.ADD_ASK_ATTACHMENTS, payload: { attachments } }
}

export function removeAskAttachment(index) {
  return { type: types.REMOVE_ASK_ATTACHMENT, payload: { index } }
}
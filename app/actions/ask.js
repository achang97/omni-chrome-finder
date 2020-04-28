import * as types from './actionTypes';

export function updateAskSearchText(text) {
  return { type: types.UPDATE_ASK_SEARCH_TEXT, payload: { text } };
}

export function togglePerformanceScore() {
  return { type: types.TOGGLE_PERFORMANCE_SCORE, payload: { } };
}

export function toggleAskFeedbackInput() {
  return { type: types.TOGGLE_ASK_FEEDBACK_INPUT, payload: { } };
}

export function updateAskFeedback(feedback) {
  return { type: types.UPDATE_ASK_FEEDBACK, payload: { feedback } };
}

export function showAskDescriptionEditor() {
  return { type: types.SHOW_ASK_DESCRIPTION_EDITOR, payload: { } };
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

export function updateAskRecipient(index, newInfo) {
  return { type: types.UPDATE_ASK_RECIPIENT, payload: { index, newInfo } };
}

export function requestAddAskAttachment(key, file) {
  return { type: types.ADD_ASK_ATTACHMENT_REQUEST, payload: { key, file } };
}

export function handleAddAskAttachmentSuccess(key, attachment) {
  return { type: types.ADD_ASK_ATTACHMENT_SUCCESS, payload: { key, attachment } };
}

export function handleAddAskAttachmentError(key, error) {
  return { type: types.ADD_ASK_ATTACHMENT_ERROR, payload: { key, error } };
}


export function requestRemoveAskAttachment(key) {
  return { type: types.REMOVE_ASK_ATTACHMENT_REQUEST, payload: { key } };
}

export function handleRemoveAskAttachmentSuccess(key) {
  return { type: types.REMOVE_ASK_ATTACHMENT_SUCCESS, payload: { key } };
}

export function handleRemoveAskAttachmentError(key, error) {
  return { type: types.REMOVE_ASK_ATTACHMENT_ERROR, payload: { key, error } };
}

export function updateAskAttachmentName(key, name) {
  return { type: types.UPDATE_ASK_ATTACHMENT_NAME, payload: { key, name } };
}


/* API Requests */
export function requestGetSlackConversations() {
  return { type: types.GET_SLACK_CONVERSATIONS_REQUEST, payload: {} };
}

export function handleGetSlackConversationsSuccess(conversations) {
  return { type: types.GET_SLACK_CONVERSATIONS_SUCCESS, payload: { conversations } };
}

export function handleGetSlackConversationsError(error) {
  return { type: types.GET_SLACK_CONVERSATIONS_ERROR, payload: { error } };
}


export function requestAskQuestion() {
  return { type: types.ASK_QUESTION_REQUEST, payload: { } };
}

export function handleAskQuestionSuccess() {
  return { type: types.ASK_QUESTION_SUCCESS, payload: { } };
}

export function handleAskQuestionError(error) {
  return { type: types.ASK_QUESTION_ERROR, payload: { error } };
}

export function clearAskQuestionInfo() {
  return { type: types.CLEAR_ASK_QUESTION_INFO, payload: { } };
}


export function requestSubmitFeedback() {
  return { type: types.SUBMIT_FEEDBACK_REQUEST, payload: { } };
}

export function handleSubmitFeedbackSuccess() {
  return { type: types.SUBMIT_FEEDBACK_SUCCESS, payload: { } };
}

export function handleSubmitFeedbackError(error) {
  return { type: types.SUBMIT_FEEDBACK_ERROR, payload: { error } };
}

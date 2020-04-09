import queryString from 'query-string';
import { take, call, fork, put, select } from 'redux-saga/effects';
import { doGet, doPost, doDelete, SERVER_URL, getErrorMessage } from '../utils/request';
import { getContentStateFromEditorState } from '../utils/editor';
import { SLACK_RECIPIENT_TYPE } from '../utils/constants';
import { convertAttachmentsToBackendFormat, isUploadedFile } from '../utils/file';
import { ASK_QUESTION_REQUEST, GET_SLACK_CONVERSATIONS_REQUEST, ADD_ASK_ATTACHMENT_REQUEST, REMOVE_ASK_ATTACHMENT_REQUEST, SUBMIT_FEEDBACK_REQUEST } from '../actions/actionTypes';
import {
  handleAskQuestionSuccess, handleAskQuestionError,
  handleGetSlackConversationsSuccess, handleGetSlackConversationsError,
  handleAddAskAttachmentSuccess, handleAddAskAttachmentError,
  handleRemoveAskAttachmentSuccess, handleRemoveAskAttachmentError,
  handleSubmitFeedbackSuccess, handleSubmitFeedbackError,
} from '../actions/ask';

export default function* watchAskRequests() {
  let action;

  while (action = yield take([
    ASK_QUESTION_REQUEST, GET_SLACK_CONVERSATIONS_REQUEST,
    ADD_ASK_ATTACHMENT_REQUEST, REMOVE_ASK_ATTACHMENT_REQUEST, SUBMIT_FEEDBACK_REQUEST,
  ])) {
    const { type, payload } = action;
    switch (type) {
      case ASK_QUESTION_REQUEST: {
        yield fork(askQuestion);
        break;
      }
      case GET_SLACK_CONVERSATIONS_REQUEST: {
        yield fork(getSlackConversations);
        break;
      }
      case ADD_ASK_ATTACHMENT_REQUEST: {
        yield fork(addAttachment, payload);
        break;
      }
      case REMOVE_ASK_ATTACHMENT_REQUEST: {
        yield fork(removeAttachment, payload);
        break;
      }
      case SUBMIT_FEEDBACK_REQUEST: {
        yield fork(submitFeedback);
        break;
      }
      default: {
        break;
      }
    }
  }
}

function* askQuestion() {
  try {
    const {
      questionTitle, questionDescription, recipients, attachments
    } = yield select(state => state.ask);
    const {
      contentState: contentStateDescription, text: descriptionText
    } = getContentStateFromEditorState(questionDescription);

    yield call(doPost, '/slack/sendUserMessage', {
      channels: recipients.map(({ id, name, type, mentions }) => ({
        id,
        name,
        mentions: type === SLACK_RECIPIENT_TYPE.CHANNEL ? mentions.map(mention => mention.id) : null
      })),
      question: questionTitle,
      description: descriptionText,
      contentStateDescription,
      attachments: convertAttachmentsToBackendFormat(attachments),
    });
    yield put(handleAskQuestionSuccess());
  } catch (error) {
    yield put(handleAskQuestionError(getErrorMessage(error)));
  }
}

function* getSlackConversations() {
  try {
    const { conversations } = yield call(doGet, '/slack/getAllConversations');
    yield put(handleGetSlackConversationsSuccess(conversations));
  } catch (error) {
    yield put(handleGetSlackConversationsError(getErrorMessage(error)));
  }
}

function* addAttachment({ key, file }) {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const attachment = yield call(doPost, '/files/upload', formData, { isForm: true });
    const { token } = yield call(doGet, `/files/${attachment.key}/accesstoken`);
    const location = `${SERVER_URL}/files/bytoken/${attachment.key}?${queryString.stringify({ token })}`;

    yield put(handleAddAskAttachmentSuccess(key, { ...attachment, location }));
  } catch (error) {
    yield put(handleAddAskAttachmentError(key, getErrorMessage(error)));
  }
}

function* removeAttachment({ key }) {
  try {
    if (isUploadedFile(key)) {
      yield call(doDelete, `/files/${key}`);
    }
    yield put(handleRemoveAskAttachmentSuccess(key));
  } catch (error) {
    yield put(handleRemoveAskAttachmentError(key, getErrorMessage(error)));
  }
}

function* submitFeedback() {
  try {
    const feedback = yield select(state => state.ask.feedback);
    yield call(doPost, '/feedback', { feedback });
    yield put(handleSubmitFeedbackSuccess());
  } catch (error) {
    yield put(handleSubmitFeedbackError(getErrorMessage(error)));
  }  
}

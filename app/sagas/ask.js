import { delay } from 'redux-saga';
import { take, call, fork, all, cancel, cancelled, put, select } from 'redux-saga/effects';
import { doGet, doPost, doPut, doDelete } from '../utils/request'
import { getContentStateFromEditorState } from '../utils/editorHelpers';
import { SLACK_RECIPIENT_TYPE } from '../utils/constants';
import { convertAttachmentsToBackendFormat, isUploadedFile } from '../utils/fileHelpers';
import { ASK_QUESTION_REQUEST, GET_SLACK_CONVERSATIONS_REQUEST, ADD_ASK_ATTACHMENT_REQUEST, REMOVE_ASK_ATTACHMENT_REQUEST } from '../actions/actionTypes';
import { 
  handleAskQuestionSuccess, handleAskQuestionError,
  handleGetSlackConversationsSuccess, handleGetSlackConversationsError,
  handleAddAskAttachmentSuccess, handleAddAskAttachmentError,
  handleRemoveAskAttachmentSuccess, handleRemoveAskAttachmentError,
} from '../actions/ask';

export default function* watchAuthRequests() {
  let action;

  while (action = yield take([ASK_QUESTION_REQUEST, GET_SLACK_CONVERSATIONS_REQUEST, ADD_ASK_ATTACHMENT_REQUEST, REMOVE_ASK_ATTACHMENT_REQUEST])) {
    const { type, payload } = action;
    switch (type) {
      case ASK_QUESTION_REQUEST: {
        yield fork(askQuestion)
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
    }
  }
}

function* askQuestion() {
  try {
    const { questionTitle, questionDescription, recipients, attachments } = yield select(state => state.ask);
    const { contentState: contentStateDescription, text: descriptionText } = getContentStateFromEditorState(questionDescription);

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
  } catch(error) {
    const { response: { data } } = error;
    yield put(handleAskQuestionError(data.error));
  }
}

function* getSlackConversations() {
  try {
    const { conversations } = yield call(doGet, '/slack/getAllConversations');
    yield put(handleGetSlackConversationsSuccess(conversations));
  } catch(error) {
    const { response: { data } } = error;
    yield put(handleGetSlackConversationsError(data.error));
  }  
}

function* addAttachment({ key, file }) {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const attachment = yield call(doPost, '/files/upload', formData, true);
    yield put(handleAddAskAttachmentSuccess(key, attachment));
  } catch(error) {
    const { response: { data } } = error;
    yield put(handleAddAskAttachmentError(key, data.error));
  }  
}

function* removeAttachment({ key }) {
  if (isUploadedFile(key)) {
    try {
      const attachment = yield call(doDelete, `/files/${key}`);
      yield put(handleRemoveAskAttachmentSuccess(key));
    } catch(error) {
      const { response: { data } } = error;
      yield put(handleRemoveAskAttachmentSuccess(key, error));
    }
  }  
}

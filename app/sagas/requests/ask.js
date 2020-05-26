import queryString from 'query-string';
import { take, call, all, fork, put, select } from 'redux-saga/effects';
import { doGet, doPost, doDelete, getErrorMessage } from 'utils/request';
import { ASK, REQUEST } from 'appConstants';
import { convertAttachmentsToBackendFormat, isUploadedFile } from 'utils/file';
import {
  ASK_QUESTION_REQUEST,
  GET_SLACK_CONVERSATIONS_REQUEST,
  ADD_ASK_ATTACHMENT_REQUEST,
  REMOVE_ASK_ATTACHMENT_REQUEST,
  GET_RECENT_CARDS_REQUEST,
  GET_ACTIVITY_LOG_REQUEST
} from 'actions/actionTypes';
import {
  handleAskQuestionSuccess,
  handleAskQuestionError,
  handleGetSlackConversationsSuccess,
  handleGetSlackConversationsError,
  handleAddAskAttachmentSuccess,
  handleAddAskAttachmentError,
  handleRemoveAskAttachmentSuccess,
  handleRemoveAskAttachmentError,
  handleGetRecentCardsSuccess,
  handleGetRecentCardsError,
  handleGetActivityLogSuccess,
  handleGetActivityLogError
} from 'actions/ask';
import { openModal } from 'actions/display';

export default function* watchAskRequests() {
  while (true) {
    const action = yield take([
      ASK_QUESTION_REQUEST,
      GET_SLACK_CONVERSATIONS_REQUEST,
      ADD_ASK_ATTACHMENT_REQUEST,
      REMOVE_ASK_ATTACHMENT_REQUEST,
      GET_RECENT_CARDS_REQUEST,
      GET_ACTIVITY_LOG_REQUEST
    ]);

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
      case GET_RECENT_CARDS_REQUEST: {
        yield fork(getRecentCards);
        break;
      }
      case GET_ACTIVITY_LOG_REQUEST: {
        yield fork(getActivityLog);
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
    const { questionTitle, recipients, attachments } = yield select((state) => state.ask);

    yield call(doPost, '/slack/sendUserMessage', {
      channels: recipients.map(({ id, name, type, mentions }) => ({
        id,
        name,
        mentions:
          type === ASK.SLACK_RECIPIENT_TYPE.CHANNEL ? mentions.map((mention) => mention.id) : null
      })),
      question: questionTitle,
      attachments: convertAttachmentsToBackendFormat(attachments)
    });
    yield all([
      put(handleAskQuestionSuccess()),
      put(openModal({ title: 'Success!', subtitle: 'Successfully sent message!' }))
    ]);
  } catch (error) {
    const message = getErrorMessage(error);
    yield all([
      put(handleAskQuestionError(message)),
      put(openModal({ title: 'Something went wrong', subtitle: message }))
    ]);
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

function* getRecentCards() {
  try {
    const cards = yield call(doGet, '/cards/recent');
    yield put(handleGetRecentCardsSuccess(cards));
  } catch (error) {
    yield put(handleGetRecentCardsError(getErrorMessage(error)));
  }
}

function* getActivityLog() {
  try {
    const activityLog = yield call(doGet, '/analytics/cards/recent');
    yield put(handleGetActivityLogSuccess(activityLog));
  } catch (error) {
    yield put(handleGetActivityLogError(getErrorMessage(error)));
  }
}

function* addAttachment({ key, file }) {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const attachment = yield call(doPost, '/files/upload', formData, { isForm: true });
    const { token } = yield call(doGet, `/files/${attachment.key}/accesstoken`);
    const location = `${REQUEST.URL.SERVER}/files/bytoken/${
      attachment.key
    }?${queryString.stringify({ token })}`;

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

import { delay } from 'redux-saga';
import { take, call, fork, all, cancel, cancelled, put, select } from 'redux-saga/effects';
import { doGet, doPost, doPut, doDelete } from '../utils/request'
import { getContentStateFromEditorState } from '../utils/editorHelpers';
import { SLACK_RECIPIENT_TYPE } from '../utils/constants';
import { ASK_QUESTION_REQUEST, GET_SLACK_CONVERSATIONS_REQUEST } from '../actions/actionTypes';
import { 
  handleAskQuestionSuccess, handleAskQuestionError,
  handleGetSlackConversationsSuccess, handleGetSlackConversationsError,
} from '../actions/ask';

export default function* watchAuthRequests() {
  let action;

  while (action = yield take([ASK_QUESTION_REQUEST, GET_SLACK_CONVERSATIONS_REQUEST])) {
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
    }
  }
}

function* askQuestion() {
  try {
    const { questionTitle, questionDescription, recipients } = yield select(state => state.ask);
    const { contentState: descriptionContentState, text: descriptionText } = getContentStateFromEditorState(questionDescription);

    yield call(doPost, '/slack/sendUserMessage', {
      channels: recipients.map(({ id, type, mentions }) => ({
        id,
        mentions: type === SLACK_RECIPIENT_TYPE.CHANNEL ? mentions.map(mention => mention.id) : null
      })),
      question: questionTitle,
      description: descriptionText,
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

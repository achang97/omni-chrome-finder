import { delay } from 'redux-saga';
import { take, call, fork, all, cancel, cancelled, put, select } from 'redux-saga/effects';
import { doGet, doPost, doPut, doDelete } from '../utils/request'
import { getContentStateFromEditorState } from '../utils/editorHelpers';
import { CARD_STATUS } from '../utils/constants';
import { ASK_QUESTION_REQUEST } from '../actions/actionTypes';
import { 
  handleAskQuestionSuccess, handleAskQuestionError,
} from '../actions/ask';

export default function* watchAuthRequests() {
  let action;

  while (action = yield take([ASK_QUESTION_REQUEST])) {
    const { type, payload } = action;
    switch (type) {
      case ASK_QUESTION_REQUEST: {
        yield fork(askQuestion)
        break;
      }
    }
  }
}

function* askQuestion() {
  try {
    const { questionTitle, questionDescription } = yield select(state => state.ask);
    const { contentState: descriptionContentState, text: descriptionText } = getContentStateFromEditorState(questionDescription);

    yield call(doPost, '/cards', {
      question: questionTitle,
      description: descriptionText,
      content_state_description: descriptionContentState,
      status: CARD_STATUS.NOT_DOCUMENTED,
    });
    yield put(handleAskQuestionSuccess());
  } catch(error) {
    const { response: { data } } = error;
    yield put(handleAskQuestionError(data.error));
  }
}

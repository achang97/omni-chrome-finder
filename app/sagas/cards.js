import { delay } from 'redux-saga';
import { take, call, fork, all, cancel, cancelled, put, select } from 'redux-saga/effects';
import { doGet, doPost, doPut, doDelete } from '../utils/request'
import { getContentStateFromEditorState } from '../utils/editorHelpers';
import { CARD_STATUS_OPTIONS } from '../utils/constants';
import { CREATE_CARD_REQUEST } from '../actions/actionTypes';
import { 
  handleCreateCardSuccess, handleCreateCardError,
} from '../actions/create';

export default function* watchCardsRequests() {
  let action;

  while (action = yield take([CREATE_CARD_REQUEST])) {
    const { type, payload } = action;
    switch (type) {
      case CREATE_CARD_REQUEST: {
        yield fork(createCard)
        break;
      }
    }
  }
}

function* createCard() {
  try {
    const { question, descriptionEditorState, answerEditorState } = yield select(state => state.create);
    const { contentState: descriptionContentState, text: descriptionText } = getContentStateFromEditorState(descriptionEditorState);
    const { contentState: answerContentState, text: answerText } = getContentStateFromEditorState(answerEditorState);

    yield call(doPost, '/cards', {
      question,
      description: descriptionText,
      content_state_description: descriptionContentState,
      answer: answerText,
      content_state_answer: answerContentState,
      status: CARD_STATUS_OPTIONS.UP_TO_DATE,
    });
    yield put(handleCreateCardSuccess());
  } catch(error) {
    const { response: { data } } = error;
    yield put(handleCreateCardError(data.error));
  }
}

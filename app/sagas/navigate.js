import { take, call, fork, put } from 'redux-saga/effects';
import { doDelete } from '../utils/request';
import { DELETE_NAVIGATE_CARD_REQUEST } from '../actions/actionTypes';
import {
  handleDeleteNavigateCardSuccess, handleDeleteNavigateCardError,
} from '../actions/navigate';

export default function* watchNavigateRequests() {
  let action;

  while (action = yield take([DELETE_NAVIGATE_CARD_REQUEST])) {
    const { type, payload } = action;
    switch (type) {
      case DELETE_NAVIGATE_CARD_REQUEST: {
        yield fork(deleteCard, payload);
        break;
      }
      default: {
        break;
      }
    }
  }
}

function* deleteCard({ cardId }) {
  try {
    yield call(doDelete, `/cards/${cardId}`);
    yield put(handleDeleteNavigateCardSuccess(cardId));
  } catch (error) {
    const { response: { data: { error: { message } } } } = error;
    yield put(handleDeleteNavigateCardError(cardId, message));
  }
}

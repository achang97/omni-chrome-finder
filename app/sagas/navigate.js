import { take, call, fork, put } from 'redux-saga/effects';
import { doDelete, getErrorMessage } from 'utils/request';
import { DELETE_NAVIGATE_CARD_REQUEST } from 'actions/actionTypes';
import { handleDeleteNavigateCardSuccess, handleDeleteNavigateCardError } from 'actions/navigate';

export default function* watchNavigateRequests() {
  while (true) {
    const action = yield take([DELETE_NAVIGATE_CARD_REQUEST]);

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
    yield put(handleDeleteNavigateCardError(cardId, getErrorMessage(error)));
  }
}

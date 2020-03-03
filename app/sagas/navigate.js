import { delay } from 'redux-saga';
import { take, call, fork, all, cancel, cancelled, put, select } from 'redux-saga/effects';
import { doGet, doPost, doPut, doDelete } from '../utils/request'
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
        yield fork(deleteCard, payload)
        break;
      }
    }
  }
}

function* deleteCard({ id }) {
  try {
    yield call(doDelete, `/cards/${id}`);
    yield put(handleDeleteNavigateCardSuccess(id));
  } catch(error) {
    const { response: { data } } = error;
    yield put(handleDeleteNavigateCardError(id, data.error));
  }
}
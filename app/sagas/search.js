import { delay } from 'redux-saga';
import { take, call, fork, all, cancel, cancelled, put, select } from 'redux-saga/effects';
import { doGet, doPost, doPut, doDelete } from '../utils/request'
import { SEARCH_CARDS_REQUEST } from '../actions/actionTypes';
import { 
  handleSearchCardsSuccess, handleSearchCardsError,
} from '../actions/search';

export default function* watchSearchRequests() {
  let action;

  while (action = yield take([SEARCH_CARDS_REQUEST])) {
    const { type, payload } = action;
    switch (type) {
      case SEARCH_CARDS_REQUEST: {
        yield fork(searchCards, payload)
        break;
      }
    }
  }
}

function* searchCards({ type, query }) {
  try {
    const { cards } = yield call(doGet, '/cards/query', { q: query });
    yield put(handleSearchCardsSuccess(type, cards));
  } catch(error) {
    const { response: { data } } = error;
    yield put(handleSearchCardsError(type, data.error));
  }
}

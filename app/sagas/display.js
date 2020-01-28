import { delay } from 'redux-saga';
import { take, call, fork, all, cancel, cancelled, put, select } from 'redux-saga/effects';
// import { doGet, doPost, doPut, doDelete } from '../utils/request'
import {
  OPEN_CARD
} from '../actions/actionTypes';
import {
} from '../actions/display';

export default function* watchDisplayRequests() {
  let action;

  while (action = yield take([OPEN_CARD])) {
    const { type, payload } = action;
    switch (type) {
      case OPEN_CARD: {
        // yield fork(getUser)
        break;
      }
    }
  }
}

// function* getUser() {
//   try {
//     const { userJson } = yield call(doGet, '/users/get')
//     yield put(getUserSuccess(userJson))
//   } catch(error) {
//     const { response: { data } } = error
//     yield put(getUserError(data.error))
//   }
// }

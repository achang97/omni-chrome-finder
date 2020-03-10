import { take, call, fork, put, select } from 'redux-saga/effects';
import { doPost } from '../utils/request';
import { LOGIN_REQUEST } from '../actions/actionTypes';
import {
  handleLoginSuccess, handleLoginError,
} from '../actions/auth';

export default function* watchAuthRequests() {
  let action;

  while (action = yield take([LOGIN_REQUEST])) {
    const { type, /* payload */ } = action;
    switch (type) {
      case LOGIN_REQUEST: {
        yield fork(login);
        break;
      }
      default: {
        break;
      }
    }
  }
}

function* login() {
  try {
    const { loginEmail, loginPassword } = yield select(state => state.auth);
    const { userJson, token, refreshToken } = yield call(doPost, '/users/login', { email: loginEmail, password: loginPassword });
    yield put(handleLoginSuccess(userJson, token, refreshToken));
  } catch (error) {
    const { response: { data } } = error;
    yield put(handleLoginError(data.error));
  }
}

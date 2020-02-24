import { delay } from 'redux-saga';
import { take, call, fork, all, cancel, cancelled, put, select } from 'redux-saga/effects';
import { doGet, doPost, doPut, doDelete } from '../utils/request'
import { LOGIN_REQUEST, GET_USER_REQUEST } from '../actions/actionTypes';
import { 
  handleLoginSuccess, handleLoginError,
  handleGetUserSuccess, handleGetUserError,
} from '../actions/auth';

export default function* watchAuthRequests() {
  let action;

  while (action = yield take([LOGIN_REQUEST, GET_USER_REQUEST])) {
    const { type, payload } = action;
    switch (type) {
      case LOGIN_REQUEST: {
        yield fork(login)
        break;
      }
      case GET_USER_REQUEST: {
        yield fork(getUser);
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
  } catch(error) {
    const { response: { data } } = error;
    yield put(handleLoginError(data.error));
  }
}


function* getUser() {
  try {
    const { userJson } = yield call(doGet, '/users');
    yield put(handleGetUserSuccess(userJson));
  } catch(error) {
    const { response: { data } } = error;
    yield put(handleGetUserError(data.error));
  }
}

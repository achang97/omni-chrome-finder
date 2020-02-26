import { delay } from 'redux-saga';
import { take, call, fork, all, cancel, cancelled, put, select } from 'redux-saga/effects';
import { doGet, doPost, doPut, doDelete } from '../utils/request'
import { LOGIN_REQUEST, SAVE_USER_REQUEST } from '../actions/actionTypes';
import { 
  handleLoginSuccess, handleLoginError, handleSaveUserSuccess, handleSaveUserError
} from '../actions/auth';

export default function* watchAuthRequests() {
  let action;

  while (action = yield take([LOGIN_REQUEST, SAVE_USER_REQUEST])) {
    const { type, payload } = action;
    switch (type) {
      case LOGIN_REQUEST: {
        yield fork(login)
        break;
      }
      case SAVE_USER_REQUEST: {
        yield fork (updateUser);
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

function* updateUser() {
  try {
    const { user, userEdits } = yield select(state => state.auth);
    const { userJson } = yield call(doPut, '/users', { user, update: userEdits });
    yield put(handleSaveUserSuccess(userJson));
  } catch(error) {
    const { response: { data } } = error;
    yield put(handleSaveUserError(error: data.error));
  }
}

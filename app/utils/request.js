import axios, { isCancel } from 'axios'
import { call, select, put } from 'redux-saga/effects';
import { logout } from '../actions/auth';

const REQUEST_TYPE = {
  POST: 'POST',
  PUT: 'PUT',
  GET: 'GET',
  DELETE: 'DELETE',
}

let SERVER_URL;
if (process.env.NODE_ENV === 'development') {
  SERVER_URL = 'http://localhost:8000/v1';
} else {
  SERVER_URL = 'https://api.eatlateplate.com/v1';
}

exports.SERVER_URL = SERVER_URL;

function isValidResponse(response) {
  return response.status >= 200 && response.status < 300;
}

function* doRequest(requestType, path, data, extraParams={}) {
  const url = `${SERVER_URL}${path}`

  // Read extra params
  const { isForm=false, cancelToken } = extraParams;

  // yield call(checkToken)
  const config = yield call(getConfig, isForm);
  config.cancelToken = cancelToken;  

  try {
    let response;
    switch (requestType) {
      case REQUEST_TYPE.POST: {
        response = yield call([axios, axios.post], url, data, config);
        break;
      }
      case REQUEST_TYPE.PUT: {
        response = yield call([axios, axios.put], url, data, config);
        break;
      }
      case REQUEST_TYPE.GET: {
        response = yield call([axios, axios.get], url, { params: { ...data}, ...config });
        break;
      }
      case REQUEST_TYPE.DELETE: {
        response = yield call([axios, axios.delete], url, {...config, data });
        break;
      }
    }

    if (!isValidResponse(response)) {
      throw { response }
    }
    return response.data
  } catch (error) {
    throw error;
  }
}

export function* doPost(path, data, extraParams) {
  try {
    return yield call(doRequest, REQUEST_TYPE.POST, path, data, extraParams);
  } catch (error) {
    throw error;
  }
}

export function* doPut(path, data, extraParams) {
  try {
    return yield call(doRequest, REQUEST_TYPE.PUT, path, data, extraParams);
  } catch (error) {
    throw error;
  }
}

export function* doGet(path, data, extraParams) {
  try {
    return yield call(doRequest, REQUEST_TYPE.GET, path, data, extraParams);
  } catch (error) {
    throw error;
  }
}

export function* doDelete(path, data, extraParams) {
  try {
    return yield call(doRequest, REQUEST_TYPE.DELETE, path, data, extraParams);
  } catch (error) {
    throw error;
  }
}

export function* checkToken() {
  const { token, refreshToken } = yield select(state => state.auth)

  if(!token) return

  // taken from web, customAxios.js
  const { exp, iat } = jwtDecode(token)
  const timeRemaining = exp - (Date.now() / 1000);

  if (timeRemaining < (exp - iat) / 2 && timeRemaining > 0) {
    // TODO:  v User
    const url = `${SERVER_URL}/users/refreshToken`
    const config = yield call(getConfig, false);
    const { data } = yield call([axios, axios.post], url, { refreshToken }, config)
    yield put(updateAuthToken(data.token))
  } else if(timeRemaining <= 0) { // logout!
    yield put(logout())
  }
}

function *getConfig(isForm) {
  const token = yield select(state => state.auth.token)

  let config = {}

  if(token) {
    config.headers = {
      'Authorization': token
    }
  }

  if (isForm) {
    config.headers['Content-Type'] = 'multipart/form-data';
  }

  return config
}
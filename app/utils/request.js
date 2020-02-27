import axios from 'axios'
import { call, select, put } from 'redux-saga/effects';
import { logout } from '../actions/auth';

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

export function* doPost(path, data) {
  const url = `${SERVER_URL}${path}`

  // yield call(checkToken)
  const config = yield call(getConfig)

  try {
    const response = yield call([axios, axios.post], url, data, config)
    if (!isValidResponse(response)) {
      throw { response }
    }
    return response.data
  } catch (error) {
    throw {
      response: error.response
    }
  }
}

export function* doPut(path, data) {
  const url = `${SERVER_URL}${path}`

  // yield call(checkToken)
  const config = yield call(getConfig)

  try {
    const response = yield call([axios, axios.put], url, data, config)
    if (!isValidResponse(response)) {
      throw { response }
    }
    return response.data
  } catch (error) {
    throw {
      response: error.response
    }
  }
}

export function* doGet(path, data) {
  const url = `${SERVER_URL}${path}`

  // yield call(checkToken)
  const config = yield call(getConfig)

  try {
    const response = yield call([axios, axios.get], url, { params: { ...data}, ...config });
    if (!isValidResponse(response)) {
      throw { response }
    }
    return response.data
  } catch (error) {
    throw {
      response: error.response
    }
  }
}

export function* doDelete(path, data) {
  const url = `${SERVER_URL}${path}`

  // yield call(checkToken)
  const config = yield call(getConfig)

  try {
    const response = yield call([axios, axios.delete], url, {...config, data })
    if (!isValidResponse(response)) {
      throw { response }
    }
    return response.data
  } catch(error) {
    throw {
      response: error.response
    }
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
    const config = yield call(getConfig)
    const { data } = yield call([axios, axios.post], url, { refreshToken }, config)
    yield put(updateAuthToken(data.token))
  } else if(timeRemaining <= 0) { // logout!
    yield put(logout())
  }
}

function *getConfig() {
  const token = yield select(state => state.auth.token)

  let config = {}

  if(token) {
    config.headers = {
      'Authorization': token
    }
  }

  return config
}
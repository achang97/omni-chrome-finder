import axios from 'axios';
import { call, select, put } from 'redux-saga/effects';
import { NODE_ENV, REQUEST } from 'appConstants';

const REQUEST_TYPE = {
  POST: 'POST',
  PUT: 'PUT',
  GET: 'GET',
  DELETE: 'DELETE',
};

function isValidResponse(response) {
  return response.status >= 200 && response.status < 300;
}

function* getConfig(isForm) {
  const token = yield select(state => state.auth.token);

  const config = {};

  if (token) {
    config.headers = {
      Authorization: token
    };
  }

  if (isForm) {
    config.headers['Content-Type'] = 'multipart/form-data';
  }

  return config;
}

function* doRequest(requestType, path, data, extraParams = {}) {
  const url = `${REQUEST.URL.SERVER}${path}`;

  // Read extra params
  const { isForm = false, cancelToken } = extraParams;

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
        response = yield call([axios, axios.get], url, { params: { ...data }, ...config });
        break;
      }
      case REQUEST_TYPE.DELETE: {
        response = yield call([axios, axios.delete], url, { ...config, data });
        break;
      }
      default: {
        break;
      }
    }

    if (!isValidResponse(response)) {
      throw { response };
    }
    return response.data;
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

export function getErrorMessage(error) {
  let message = _.get(error, 'response.data.error.message');

  if (!message) {
    message = _.get(error, "message", "Something went wrong!");
  }

  return message;
}

export default { doPost, doGet, doPut, doDelete, getErrorMessage };

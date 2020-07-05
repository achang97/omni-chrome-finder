import axios from 'axios';
import _ from 'lodash';
import { call, select } from 'redux-saga/effects';
import { REQUEST } from 'appConstants';

const REQUEST_TYPE = {
  POST: 'POST',
  PUT: 'PUT',
  GET: 'GET',
  DELETE: 'DELETE'
};

export function createConfig(token, isForm = false) {
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

function* getConfig(isForm) {
  const token = yield select((state) => state.auth.token);
  return createConfig(token, isForm);
}

function* doRequest(requestType, path, data, extraParams = {}) {
  const url = `${REQUEST.URL.SERVER}${path}`;

  // Read extra params
  const { isForm, cancelToken } = extraParams;

  const config = yield call(getConfig, isForm);
  config.cancelToken = cancelToken;

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

  return response.data;
}

export function* doPost(path, data, extraParams) {
  return yield call(doRequest, REQUEST_TYPE.POST, path, data, extraParams);
}

export function* doPut(path, data, extraParams) {
  return yield call(doRequest, REQUEST_TYPE.PUT, path, data, extraParams);
}

export function* doGet(path, data, extraParams) {
  return yield call(doRequest, REQUEST_TYPE.GET, path, data, extraParams);
}

export function* doDelete(path, data, extraParams) {
  return yield call(doRequest, REQUEST_TYPE.DELETE, path, data, extraParams);
}

export function getErrorMessage(error) {
  let message = _.get(error, 'response.data.error.message');

  if (!message) {
    message = _.get(error, 'message', 'Something went wrong!');
  }

  return message;
}

export default { doPost, doGet, doPut, doDelete, createConfig, getErrorMessage };

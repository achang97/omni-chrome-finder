import { NODE_ENV } from './general';

let url, protocol;
if (process.env.NODE_ENV === NODE_ENV.DEV) {
  url = 'localhost:8000';
  protocol = 'http://';
} else {
  url = 'api.addomni.com';
  protocol = 'https://';
}

export const URL = {
  BASE: `${url}/v1`,
  SERVER: `${protocol}${url}/v1`
}

export const HTTP_STATUS_CODE = {
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
}

export default { URL, HTTP_STATUS_CODE };
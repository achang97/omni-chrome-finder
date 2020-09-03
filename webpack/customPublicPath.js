const browser = require('webextension-polyfill');

/* eslint-disable no-global-assign, camelcase, no-unused-vars */
/* global __webpack_public_path__ __HOST__ __PORT__ */
__webpack_public_path__ = browser.extension.getURL('/');

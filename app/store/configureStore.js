import { NODE_ENV } from 'appConstants';

let createStore;
if (process.env.NODE_ENV === NODE_ENV.PROD) {
  createStore = require('./configureStore.prod').default;
} else {
  createStore = require('./configureStore.dev').default;
}

export default createStore;
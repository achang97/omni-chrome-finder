import { NODE_ENV } from '../utils/constants';

let filePath;
if (process.env.NODE_ENV === NODE_ENV.PROD) {
  filePath = './configureStore.prod';
} else {
  filePath = './configureStore.dev';
}

const createStore = require('./configureStore.dev').default;
export default createStore;
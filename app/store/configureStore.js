import { NODE_ENV } from '../utils/constants';

if (process.env.NODE_ENV === NODE_ENV.PROD) {
  module.exports = require('./configureStore.prod');
} else {
  module.exports = require('./configureStore.dev');
}

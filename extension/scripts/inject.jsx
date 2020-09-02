import React from 'react';
import ReactDOM from 'react-dom';
import * as Sentry from '@sentry/browser';
import { getStorage } from 'utils/storage';
import { MAIN_CONTAINER_ID, CHROME, NODE_ENV } from 'appConstants';
import { initialState as authInitialState } from 'reducers/auth';
import { initialState as profileInitialState } from 'reducers/profile';
import { initialState as tasksInitialState } from 'reducers/tasks';
import { addScript } from 'utils/window';
import Root from 'containers/Root';

function render(state, wrapper) {
  if (process.env.NODE_ENV === NODE_ENV.PROD) {
    Sentry.init({
      dsn: 'https://b1ba8c5c572a4f5697caabb564e0bbfe@o403492.ingest.sentry.io/5266283'
    });
  }

  // Import has to be here for Redux dev tools to work
  // eslint-disable-next-line global-require
  const createStore = require('store/configureStore').default;
  ReactDOM.render(<Root store={createStore(state)} />, wrapper);
}

(() => {
  const { body } = document;

  const wrapper = document.createElement('div');
  wrapper.id = MAIN_CONTAINER_ID;
  wrapper.style = 'all: initial; position: absolute; z-index: 2147483646;';
  body.appendChild(wrapper);

  // Embedly script
  addScript({ url: 'https://cdn.embedly.com/widgets/platform.js' });

  const initialState = {};

  Promise.all([getStorage(CHROME.STORAGE.AUTH), getStorage(CHROME.STORAGE.TASKS)])
    .then(([auth, tasks]) => {
      if (auth) {
        const { user, token, refreshToken } = auth;

        initialState.auth = {
          ...authInitialState,
          token,
          refreshToken
        };
        initialState.profile = {
          ...profileInitialState,
          user
        };
      }

      if (tasks) {
        initialState.tasks = {
          ...tasksInitialState,
          tasks
        };
      }

      render(initialState, wrapper);
    })
    .catch(() => {
      render(initialState, wrapper);
    });
})();

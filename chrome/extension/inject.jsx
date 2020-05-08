import React from 'react';
import ReactDOM from 'react-dom';
import { getStorage } from 'utils/storage';
import { MAIN_CONTAINER_ID, CHROME } from 'appConstants';
import { initialState as authInitialState } from 'reducers/auth';
import { initialState as profileInitialState } from 'reducers/profile';
import { initialState as tasksInitialState } from 'reducers/tasks';
import Root from 'containers/Root';

function render(state, wrapper) {
  // Import has to be here for Redux dev tools to work
  // eslint-disable-next-line global-require
  const createStore = require('store/configureStore').default;
  ReactDOM.render(<Root store={createStore(state)} />, wrapper);
}

(() => {
  const { body } = document;

  const wrapper = document.createElement('div');
  wrapper.id = MAIN_CONTAINER_ID;
  wrapper.style = 'all: initial;';
  body.insertBefore(wrapper, body.firstChild);

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

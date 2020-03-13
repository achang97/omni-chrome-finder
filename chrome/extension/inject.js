import React from 'react';
import ReactDOM from 'react-dom';
import { getStorage } from '../../app/utils/storage';
import { MAIN_CONTAINER_ID } from '../../app/utils/constants';
import Root from '../../app/containers/Root';

function render(state, wrapper) {
  // Import has to be here for Redux dev tools to work
  const createStore = require('../../app/store/configureStore');
  ReactDOM.render(
    <Root store={createStore(state)} />,
    wrapper
  );  
}

(function () {
  const body = document.body;

  const wrapper = document.createElement('div');
  wrapper.id = MAIN_CONTAINER_ID;
  wrapper.style = 'all: initial;';
  body.insertBefore(wrapper, body.firstChild);

  const initialState = {};

  Promise.all([getStorage('auth'), getStorage('tasks')])
    .then(([auth, tasks]) => {
      console.log(auth, tasks)
      if (auth) {
        const { user, token, refreshToken } = auth;
        initialState.auth = { token, refreshToken };
        initialState.profile = { user };
      }

      if (tasks) {
        initialState.tasks = tasks;
      }

      render(initialState, wrapper);
    })
    .catch((error) => {
      render(initialState, wrapper);
    });
}());

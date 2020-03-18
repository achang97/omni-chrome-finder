import React from 'react';
import ReactDOM from 'react-dom';
import { getStorage } from '../../app/utils/storage';
import { MAIN_CONTAINER_ID } from '../../app/utils/constants';
import { createSectionedTasks } from '../../app/utils/tasks';
import { initialState as authInitialState } from '../../app/reducers/auth';
import { initialState as profileInitialState } from '../../app/reducers/profile';
import { initialState as tasksInitialState } from '../../app/reducers/tasks';
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
          tasks: createSectionedTasks(tasks)
        };
      }

      render(initialState, wrapper);
    })
    .catch((error) => {
      render(initialState, wrapper);
    });
}());

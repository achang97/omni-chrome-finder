import React from 'react';
import ReactDOM from 'react-dom';
import { getStorage, getStorageName } from '../../app/utils/storage';
import { MAIN_CONTAINER_ID } from '../../app/utils/constants';
import Root from '../../app/containers/Root';

(function () {
  const body = document.body;

  const wrapper = document.createElement('div');
  wrapper.id = MAIN_CONTAINER_ID;
  wrapper.style = 'all: initial;';
  body.insertBefore(wrapper, body.firstChild);

  getStorage('auth', (obj) => {
    let initialState = {};

    const currAuth = obj[getStorageName('auth')];
    if (currAuth) {
      const { user, token, refreshToken } = JSON.parse(currAuth);
      initialState = {
        auth: { token, refreshToken },
        profile: { user }
      };
    }

    const createStore = require('../../app/store/configureStore');

    ReactDOM.render(
      <Root store={createStore(initialState)} />,
      wrapper
    );
  });
}());

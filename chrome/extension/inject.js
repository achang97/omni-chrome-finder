import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Root from '../../app/containers/Root';

const targetElem = document.querySelector('body');
const wrapper = document.createElement('div');
wrapper.id = 'omni-chrome-ext-main-container';
wrapper.style = 'all: initial;';
targetElem.insertBefore(wrapper, targetElem.firstChild);

chrome.storage.local.get('state', (obj) => {
  const { state } = obj;
  const initialState = JSON.parse(state || '{}');

  const createStore = require('../../app/store/configureStore');

  ReactDOM.render(
    <Root {...createStore(initialState)} />,
    wrapper // document.querySelector('#root')
  );
});

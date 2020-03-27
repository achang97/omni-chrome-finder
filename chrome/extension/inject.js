import React from 'react';
import ReactDOM from 'react-dom';
import { getStorage, setStorage } from '../../app/utils/storage';
import { MAIN_CONTAINER_ID } from '../../app/utils/constants';
import { addScript, isHeap } from '../../app/utils/heap';
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

  const heapId = process.env.NODE_ENV === 'development' ? "3148523243" :"26662418";
  if(!isHeap()) {
    const script = `
      window.heap=window.heap||[],heap.load=function(e,t){window.heap.appid=e,window.heap.config=t=t||{};var r=document.createElement("script");r.type="text/javascript",r.async=!0,r.src="https://cdn.heapanalytics.com/js/heap-"+e+".js";var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(r,a);for(var n=function(e){return function(){heap.push([e].concat(Array.prototype.slice.call(arguments,0)))}},p=["addEventProperties","addUserProperties","clearEventProperties","identify","resetIdentity","removeEventProperty","setEventProperties","track","unsetEventProperty"],o=0;o<p.length;o++)heap[p[o]]=n(p[o])};
      heap.load('${heapId}');
    `;
    addScript({ code: script, shouldRemove: false });
  }

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
          tasks
        };
      }

      render(initialState, wrapper);
    })
    .catch((error) => {
      render(initialState, wrapper);
    });
}());

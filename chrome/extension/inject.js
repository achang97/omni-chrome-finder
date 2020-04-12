import React from 'react';
import ReactDOM from 'react-dom';
import { heap, window as windowUtils, storage } from 'utils';
import { MAIN_CONTAINER_ID } from 'appConstants';
import { initialState as authInitialState } from 'reducers/auth';
import { initialState as profileInitialState } from 'reducers/profile';
import { initialState as tasksInitialState } from 'reducers/tasks';
import Root from 'containers/Root';

function render(state, wrapper) {
  // Import has to be here for Redux dev tools to work
  const createStore = require('store/configureStore').default;
  ReactDOM.render(
    <Root store={createStore(state)} />,
    wrapper
  );  
}

(function () {
  const body = document.body;
  if(!heap.isHeap()) {
    const script = `
      window.heap=window.heap||[],heap.load=function(e,t){window.heap.appid=e,window.heap.config=t=t||{};var r=document.createElement("script");r.type="text/javascript",r.async=!0,r.src="https://cdn.heapanalytics.com/js/heap-"+e+".js";var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(r,a);for(var n=function(e){return function(){heap.push([e].concat(Array.prototype.slice.call(arguments,0)))}},p=["addEventProperties","addUserProperties","clearEventProperties","identify","resetIdentity","removeEventProperty","setEventProperties","track","unsetEventProperty"],o=0;o<p.length;o++)heap[p[o]]=n(p[o])};
      heap.load('${process.env.HEAP_APP_ID}');
    `;
    windowUtils.addScript({ code: script });
  }

  const wrapper = document.createElement('div');
  wrapper.id = MAIN_CONTAINER_ID;
  wrapper.style = 'all: initial;';
  body.insertBefore(wrapper, body.firstChild);

  const initialState = {};

  Promise.all([storage.getStorage('auth'), storage.getStorage('tasks')])
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

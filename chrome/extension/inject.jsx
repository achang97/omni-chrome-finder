import React from 'react';
import ReactDOM from 'react-dom';
import * as Sentry from '@sentry/browser';
import { getStorage } from 'utils/storage';
import { addScript } from 'utils/window';
import { MAIN_CONTAINER_ID, CHROME, NODE_ENV } from 'appConstants';
import { initialState as authInitialState } from 'reducers/auth';
import { initialState as profileInitialState } from 'reducers/profile';
import { initialState as tasksInitialState } from 'reducers/tasks';
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

  // Inject Segment Code
  const segmentScript = `
    !function(){
      var analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","debug","page","once","off","on"];analytics.factory=function(t){return function(){var e=Array.prototype.slice.call(arguments);e.unshift(t);analytics.push(e);return analytics}};for(var t=0;t<analytics.methods.length;t++){var e=analytics.methods[t];analytics[e]=analytics.factory(e)}analytics.load=function(t,e){var n=document.createElement("script");n.type="text/javascript";n.async=!0;n.src="https://cdn.segment.com/analytics.js/v1/"+t+"/analytics.min.js";var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(n,a);analytics._loadOptions=e};analytics.SNIPPET_VERSION="4.1.0";
      if (analytics) {
        analytics.load('${process.env.SEGMENT_KEY}');
        analytics.page();
      }
    }}();
  `;
  addScript({ code: segmentScript });

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

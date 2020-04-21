import React from 'react';
import ReactDOM from 'react-dom';
import { heap, window as windowUtils, storage } from 'utils';
import { MAIN_CONTAINER_ID, CHROME } from 'appConstants';
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
  /*
  if(!heap.isHeap()) {
    const script = `
      window.heap=window.heap||[],heap.load=function(e,t){window.heap.appid=e,window.heap.config=t=t||{};var r=document.createElement("script");r.type="text/javascript",r.async=!0,r.src="https://cdn.heapanalytics.com/js/heap-"+e+".js";var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(r,a);for(var n=function(e){return function(){heap.push([e].concat(Array.prototype.slice.call(arguments,0)))}},p=["addEventProperties","addUserProperties","clearEventProperties","identify","resetIdentity","removeEventProperty","setEventProperties","track","unsetEventProperty"],o=0;o<p.length;o++)heap[p[o]]=n(p[o])};
      heap.load('${process.env.HEAP_APP_ID}');
    `;
    windowUtils.addScript({ code: script });
  }
  */
  /*
  const segmentScript = `!function(){var analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","debug","page","once","off","on"];analytics.factory=function(t){return function(){var e=Array.prototype.slice.call(arguments);e.unshift(t);analytics.push(e);return analytics}};for(var t=0;t<analytics.methods.length;t++){var e=analytics.methods[t];analytics[e]=analytics.factory(e)}analytics.load=function(t,e){var n=document.createElement("script");n.type="text/javascript";n.async=!0;n.src="https://cdn.segment.com/analytics.js/v1/"+t+"/analytics.min.js";var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(n,a);analytics._loadOptions=e};analytics.SNIPPET_VERSION="4.1.0";
        analytics.load("BEt2BaUmDZOxhU7PGp1TFjej1ij8gl97");
        analytics.page();

        analytics.identify('${user._id}', { 'Name': "${user.firstname + " " + user.lastname}", 'Company': "${user.company.companyName}", 'Email': "${user.email}", 'Role': "${user.role}"});
        analytics.track('Open Extension');
        }}();`
      windowUtils.addScript({ code: segmentScript });
*/
  const wrapper = document.createElement('div');
  wrapper.id = MAIN_CONTAINER_ID;
  wrapper.style = 'all: initial;';
  body.insertBefore(wrapper, body.firstChild);

  const initialState = {};

  Promise.all([storage.getStorage(CHROME.STORAGE.AUTH), storage.getStorage(CHROME.STORAGE.TASKS)])
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

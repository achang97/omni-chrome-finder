import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Root from '../../app/containers/Root';

const targetElem = document.querySelector('body');
const wrapper = document.createElement('div');
targetElem.insertBefore(wrapper, targetElem.firstChild);

chrome.storage.local.get('state', (obj) => {
  const { state } = obj;
  const initialState = JSON.parse(state || '{}');

  const createStore = require('../../app/store/configureStore');

  ReactDOM.render(
    <Root store={createStore(initialState)} />,
    wrapper // document.querySelector('#root')
  );
});


// var iframe = null;

// if (!iframe) {
// 	var iframe = document.createElement('iframe'); 
// 	iframe.style.height = "100%";
// 	iframe.style.width = "300px";
// 	iframe.style.position = "fixed";
// 	iframe.style.top = "0px";
// 	iframe.style.right = "0px";
// 	iframe.style.zIndex = "9000000000000000000";
// 	iframe.frameBorder = "none"; 
// 	iframe.src = chrome.extension.getURL(`inject.html?protocol=${location.protocol}`)

// 	document.body.appendChild(iframe);
// }

// chrome.runtime.onMessage.addListener(function(msg, sender){
//   if(msg == "toggle"){
//     toggle();
//   }
// })

// function toggle(){
//   if(iframe.style.width == "0px"){
//     iframe.style.width = "300px";
//   }
//   else{
//     iframe.style.width = "0px";
//   }
// }

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import loadjs from 'loadjs';
import { getStorage, getStorageName } from '../../app/utils/storage';
import Root from '../../app/containers/Root';

function addScript(src) {
	var script = document.createElement('script');
	script.setAttribute('src', src);
	document.body.appendChild(script);
}

chrome.storage.sync.get('state', (obj) => {
	const { state } = obj;
	const initialState = JSON.parse(state || '{}');

	const createStore = require('../../app/store/configureStore');

	// The core Firebase JS SDK is always required and must be listed first
	const firebaseMainUrl = ['https://www.gstatic.com/firebasejs/7.10.0/firebase-app.js'];
	const firebaseSdkUrls = [
		// Specific SDKs: Analytics and Messaging
		"https://www.gstatic.com/firebasejs/7.10.0/firebase-analytics.js",
		"https://www.gstatic.com/firebasejs/7.10.0/firebase-messaging.js"
	];

	const loadParams = {
		before: (path, scriptEl) => {
			document.body.appendChild(scriptEl);

			/* return `false` to bypass default DOM insertion mechanism */
			return false;
		},
		returnPromise: true,
	}

	loadjs(firebaseMainUrl, loadParams)
		.then(() => loadjs(firebaseSdkUrls, loadParams))
		.catch((error) => {
			// TODO: handle error
			console.log(error);
		}) 
		.then(() => addScript(chrome.runtime.getURL('web_accessible/firebase.js')));

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
	})
})();
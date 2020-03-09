import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import loadjs from 'loadjs';
import { getStorage, getStorageName } from '../../app/utils/storage';
import Root from '../../app/containers/Root';

(function() {	
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
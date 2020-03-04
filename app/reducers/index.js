import { combineReducers } from 'redux';
import auth from './auth';
import display from './display';
import cards from './cards';
import ask from './ask';
import create from './create';
import navigate from './navigate';
import tasks from './tasks';
import search from './search';
import profile from './profile';
import { persistStore, persistReducer } from 'redux-persist'
import { getStorageName } from '../utils/constants';
import { syncStorage } from 'redux-persist-webextension-storage'
import { LOGOUT, LOGIN_SUCCESS, GET_USER_SUCCESS } from '../actions/actionTypes';

const authPersistConfig = {
  key: getStorageName('auth'),
  storage: syncStorage,
  whitelist: ['refreshToken', 'token'],
}

const profilePersistConfig = {
  key: getStorageName('profile'),
  storage: syncStorage,
  whitelist: ['user'],
}

const appReducer = combineReducers({
  auth: persistReducer(authPersistConfig, auth),
  profile: persistReducer(profilePersistConfig, profile),
  display,
  cards,
  ask,
  create,
  navigate,
  tasks,
  search,
});

const syncAuthStorage = (payload) => {
  chrome.storage.sync.set({
    [getStorageName('auth')]: JSON.stringify(payload)
  });  
}

const rootReducer = (state, action) => {
  switch (action.type) {
    // Dispatch an action to sync login across tabs
    case LOGIN_SUCCESS:
      syncAuthStorage(action.payload);
      break;
    case GET_USER_SUCCESS: {
      const { payload: { user } } = action;
      const { auth: { token, refreshToken } } = state;
      syncAuthStorage({ user, token, refreshToken });
      break;
    }
    case LOGOUT: {
      // Remove all persist information
      syncStorage.removeItem(`persist:${getStorageName('auth')}`);
      syncStorage.removeItem(`persist:${getStorageName('profile')}`);

      // Dispatch action to sync logout across tabs
      chrome.storage.sync.set({
        [getStorageName('auth')]: JSON.stringify({ user: {}, token: null, refreshToken: null }),
      });

      state = undefined;
      break;
    }
  }

  return appReducer(state, action);
}

export default rootReducer;
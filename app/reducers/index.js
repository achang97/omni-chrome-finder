import { combineReducers } from 'redux';
import auth from './auth';
import display from './display';
import cards from './cards';
import ask from './ask';
import create from './create';
import navigate from './navigate';
import tasks from './tasks';
import search from './search';
import { persistStore, persistReducer } from 'redux-persist'
import { getStorageName } from '../utils/constants';
import { syncStorage } from 'redux-persist-webextension-storage'
import { LOGOUT } from '../actions/actionTypes';

const authPersistConfig = {
  key: getStorageName('auth'),
  storage: syncStorage,
  whitelist: ['isLoggedIn', 'refreshToken', 'token', 'user'],
}

const appReducer = combineReducers({
  auth: persistReducer(authPersistConfig, auth),
  display,
  cards,
  ask,
  create,
  navigate,
  tasks,
  search,
});

const rootReducer = (state, action) => {
  if (action.type === LOGOUT) {
    // REMOVE EVERYTHING
    syncStorage.removeItem(`persist:${getStorageName('auth')}`);
    chrome.storage.sync.set({
      [getStorageName('auth')]: JSON.stringify({ user: {}, token: null, refreshToken: null, isLoggedIn: false })
    });
    state = undefined;
  }
  return appReducer(state, action);
}

export default rootReducer;
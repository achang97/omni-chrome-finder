import { combineReducers } from 'redux';
import auth from './auth';
import display from './display';
import cards from './cards';
import ask from './ask';
import create from './create';
import navigate from './navigate';
import tasks from './tasks';
import { persistStore, persistReducer } from 'redux-persist'
import { localStorage } from 'redux-persist-webextension-storage'
import { LOGOUT } from '../actions/actionTypes';

const authPersistConfig = {
  key: 'OMNI_EXTENSION_auth',
  storage: localStorage,
  whitelist: ['isLoggedIn', 'user', 'refreshToken', 'token'],
}

const appReducer = combineReducers({
  auth: persistReducer(authPersistConfig, auth),
  display,
  cards,
  ask,
  create,
  navigate,
  tasks
});

const rootReducer = (state, action) => {
  if (action.type === LOGOUT) {
    // REMOVE EVERYTHING
    localStorage.removeItem('persist:OMNI_EXTENSION_auth');
    state = undefined;
  }
  return appReducer(state, action);
}

export default rootReducer;
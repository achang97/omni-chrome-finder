import { combineReducers } from 'redux';
import auth from './auth';
import profile from './profile';
import display from './display';
import cards from './cards';
import ask from './ask';
import create from './create';
import navigate from './navigate';
import tasks from './tasks';
import search from './search';
import screenRecording from './screenRecording';
import auditLog from './auditLog';

import { LOGOUT } from 'actions/actionTypes';

const appReducer = combineReducers({
  auth,
  profile,
  display,
  cards,
  ask,
  create,
  navigate,
  tasks,
  search,
  screenRecording,
  auditLog,
});

const rootReducer = (state, action) => {
  if (action.type === LOGOUT) {
    state = undefined;
  }

  return appReducer(state, action);
};

export default rootReducer;

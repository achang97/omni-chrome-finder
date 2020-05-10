import { combineReducers } from 'redux';
import { LOGOUT } from 'actions/actionTypes';
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
  auditLog
});

const rootReducer = (state, action) => {
  let nextState = state;
  if (action.type === LOGOUT) {
    nextState = undefined;
  }

  return appReducer(nextState, action);
};

export default rootReducer;

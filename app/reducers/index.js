import { combineReducers } from 'redux';
import display from './display';
import cards from './cards';
import ask from './ask';

export default combineReducers({
  display,
  cards,
  ask,
});

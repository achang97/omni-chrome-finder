import { combineReducers } from 'redux';
import display from './display';
import cards from './cards';

export default combineReducers({
  display,
  cards,
});

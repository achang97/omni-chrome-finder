import { combineReducers } from 'redux';
import display from './display';
import cards from './cards';
import ask from './ask';
import create from './create';
import navigate from './navigate';

export default combineReducers({
  display,
  cards,
  ask,
  create,
  navigate
});

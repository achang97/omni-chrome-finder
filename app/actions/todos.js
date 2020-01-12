import * as types from './actionTypes';

export function addTodo(text) {
  return { type: types.ADD_TODO, payload: { text } };
}
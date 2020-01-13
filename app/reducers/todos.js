import * as types from '../actions/actionTypes';

const initialState = [{

}];

const actionsMap = {
  [types.ADD_TODO](state, action) {
    return [{ /* new state */ }, ...state];
  },
};

export default function todos(state = initialState, action) {
  const reduceFn = actionsMap[action.type];
  if (!reduceFn) return state;
  return reduceFn(state, action);
}

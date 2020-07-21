import { INITIAL_STATE } from './utils';

import cardWindowReducer from './cardWindow';
import activeCardReducer from './activeCard';
import cardRequestsReducer from './cardRequests';

const REDUCERS = [cardWindowReducer, activeCardReducer, cardRequestsReducer];

export default function cardsReducer(state = INITIAL_STATE, action) {
  let i;
  for (i = 0; i < REDUCERS.length; i++) {
    const reducer = REDUCERS[i];
    const newState = reducer(state, action);
    if (newState) {
      return newState;
    }
  }
  return state;
}

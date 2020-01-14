import * as types from '../actions/actionTypes';
import _ from 'underscore';

const initialState = {
  dockVisible: false,
	cards: [],
};

export default function display(state=initialState, action) {
  const { type, payload = {} } = action

  switch (type) {
    case types.TOGGLE_DOCK: {
      return { ...state, dockVisible: !state.dockVisible };
    }
    case types.OPEN_CARD: {
      const { id } = payload;
      return { ...state, cards: _.union(state.cards, [id]) };
    }
    case types.CLOSE_CARD: {
      const { id } = payload;
      return { ...state, cards: _.without(state.cards, id) };
    }

    default:
      return state;
  }
}
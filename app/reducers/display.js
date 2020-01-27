import * as types from '../actions/actionTypes';
import _ from 'underscore';

const initialState = {
  dockVisible: false,
  dockExpanded: false,
  cards: [],
  activeCardIndex: -1,
};

export default function display(state = initialState, action) {
  const { type, payload = {} } = action;

  switch (type) {
    case types.TOGGLE_DOCK: {
      return { ...state, dockVisible: !state.dockVisible, dockExpanded: !state.dockVisible ? false : state.dockExpanded };
    }
    case types.EXPAND_DOCK: {
      return { ...state, dockExpanded: !state.dockExpanded };
    }

    case types.OPEN_CARD: {
      const { id } = payload;
      const newCards = _.union(state.cards, [id]);
      return { ...state, cards: newCards, activeCardIndex: newCards.length - 1 };
    }
    case types.SET_ACTIVE_CARD_INDEX: {
      const { index } = payload;
      return { ...state, activeCardIndex: index };
    }
    case types.CLOSE_CARD: {
      const { id } = payload;
      const newCards = _.without(state.cards, id);

      let activeCardIndex = state.activeCardIndex;
      if (newCards.length === 0) {
        activeCardIndex = -1;
      } else if (activeCardIndex >= newCards.length) {
        activeCardIndex = newCards.length - 1;
      }

      return { ...state, cards: newCards, activeCardIndex };
    }
    case types.CLOSE_ALL_CARDS: {
      return { ...state, cards: [], activeCardIndex: -1 };
    }

    default:
      return state;
  }
}

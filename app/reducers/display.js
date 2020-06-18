import * as types from 'actions/actionTypes';

const initialState = {
  dockVisible: false,
  toggleTabShown: false,
  autofindShown: true,
  toggleTabY: 50,

  modalOpen: false,
  modalProps: {
    title: ''
  },

  onlyShowSearchBar: false,
  hasClosedSearchBar: false
};

export default function displayReducer(state = initialState, action) {
  const { type, payload = {} } = action;

  switch (type) {
    case types.TOGGLE_DOCK: {
      return {
        ...state,
        dockVisible: !state.dockVisible,
        toggleTabShown: false,
        onlyShowSearchBar: false
      };
    }
    case types.MINIMIZE_DOCK: {
      return { ...state, toggleTabShown: true, dockVisible: false, onlyShowSearchBar: false };
    }
    case types.HIDE_TOGGLE_TAB: {
      return { ...state, toggleTabShown: false };
    }
    case types.TOGGLE_AUTOFIND_TAB: {
      return { ...state, autofindShown: !state.autofindShown };
    }

    case types.OPEN_MODAL: {
      const { modalProps } = payload;
      return { ...state, modalOpen: true, modalProps };
    }
    case types.CLOSE_MODAL: {
      return { ...state, modalOpen: false, modalProps: {} };
    }

    case types.UPDATE_TOGGLE_TAB_POSITION: {
      const { newY } = payload;
      return { ...state, toggleTabY: newY };
    }

    case types.TOGGLE_SEARCH_BAR: {
      return { ...state, onlyShowSearchBar: !state.onlyShowSearchBar };
    }
    case types.MINIMIZE_SEARCH_BAR: {
      return { ...state, onlyShowSearchBar: false, toggleTabShown: true, hasClosedSearchBar: true };
    }

    default:
      return state;
  }
}

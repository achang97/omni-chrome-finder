import * as types from 'actions/actionTypes';

const initialState = {
  dockVisible: false,
  dockExpanded: false,
  toggleTabShown: false,

  modalOpen: false,
  modalProps: {
    title: ''
  },
};

export default function displayReducer(state = initialState, action) {
  const { type, payload = {} } = action;

  switch (type) {
    case types.TOGGLE_DOCK: {
      return { ...state, dockVisible: !state.dockVisible, dockExpanded: false, toggleTabShown: false };
    }
    case types.TOGGLE_DOCK_HEIGHT: {
      return { ...state, dockExpanded: !state.dockExpanded };
    }
    case types.MINIMIZE_DOCK: {
      return { ...state, toggleTabShown: true, dockVisible: false, dockExpanded: false  };
    }
    case types.HIDE_TOGGLE_TAB: {
      return { ...state, toggleTabShown: false };
    }

    case types.OPEN_MODAL: {
      const { modalProps } = payload;
      return { ...state, modalOpen: true, modalProps };
    }
    case types.CLOSE_MODAL: {
      return { ...state, modalOpen: false, modalProps: {} };
    }

    default:
      return state;
  }
}

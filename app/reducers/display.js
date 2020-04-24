import * as types from 'actions/actionTypes';

const initialState = {
  dockVisible: false,
  dockExpanded: false,
  showToggleTab: false,

  modalOpen: false,
  modalProps: {
    title: ''
  },
};

export default function displayReducer(state = initialState, action) {
  const { type, payload = {} } = action;

  switch (type) {
    case types.TOGGLE_DOCK: {
      return { ...state, dockVisible: !state.dockVisible, dockExpanded: false, showToggleTab: false };
    }
    case types.EXPAND_DOCK: {
      return { ...state, dockExpanded: true };
    }
    case types.MINIMIZE_DOCK: {
      return { ...state, showToggleTab: true, dockVisible: false, dockExpanded: false  };
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

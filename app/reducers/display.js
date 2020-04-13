import * as types from 'actions/actionTypes';

const initialState = {
  dockVisible: false,
  dockExpanded: false,

  modalOpen: false,
  modalProps: {},
};

export default function displayReducer(state = initialState, action) {
  const { type, payload = {} } = action;

  switch (type) {
    case types.TOGGLE_DOCK: {
      return {
        ...state,
        dockVisible: !state.dockVisible,
        dockExpanded: !state.dockVisible ? false : state.dockExpanded
      };
    }
    case types.EXPAND_DOCK: {
      return { ...state, dockExpanded: true };
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

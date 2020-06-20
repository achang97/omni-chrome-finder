import * as types from 'actions/actionTypes';

const initialState = {
  activeId: null,
  isSharingDesktop: false,
  recordedChunks: [],
  onSuccess: null
};

export default function screenRecordingReducer(state = initialState, action) {
  const { type, payload = {} } = action;

  switch (type) {
    case types.INIT_SCREEN_RECORDING: {
      const { id, onSuccess } = payload;
      return { ...state, activeId: id, onSuccess };
    }
    case types.START_SCREEN_RECORDING: {
      return { ...state, isSharingDesktop: true };
    }
    case types.ADD_SCREEN_RECORDING_CHUNK: {
      if (state.isSharingDesktop) {
        const { recordingChunk } = payload;
        return { ...state, recordedChunks: [...state.recordedChunks, recordingChunk] };
      }

      return state;
    }
    case types.END_SCREEN_RECORDING: {
      return { ...state, isSharingDesktop: false, activeId: null };
    }
    case types.CLEAR_SCREEN_RECORDING: {
      return initialState;
    }

    default:
      return state;
  }
}

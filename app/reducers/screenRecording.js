import * as types from '../actions/actionTypes';

const initialState = {
  isSharingDesktop: false,
  localStream: null,
  mediaRecorder: null,
  recordedChunks: [],
};

export default function screenRecordingReducer(state = initialState, action) {
  const { type, payload = {} } = action;

  switch (type) {
    case types.START_SCREEN_RECORDING: {
      const { stream, mediaRecorder } = payload;
      return {
        ...state,
        isSharingDesktop: true,
        localStream: stream,
        mediaRecorder,
      };
    }
    case types.ADD_SCREEN_RECORDING_CHUNK: {
      const { recordingChunk } = payload;
      return { ...state, recordedChunks: [...state.recordedChunks, recordingChunk] };
    }
    case types.END_SCREEN_RECORDING: {
      return {
        ...state,
        isSharingDesktop: false,
        localStream: null,
        mediaRecorder: null,
        recordedChunks: [],
      };
    }
    case types.SCREEN_RECORDING_ERROR: {
      const { error } = payload;
      return {
        ...state,
        isSharingDesktop: false,
        localStream: null,
        mediaRecorder: null,
        recordedChunks: [],
      };
    }

    default:
      return state;
  }
}

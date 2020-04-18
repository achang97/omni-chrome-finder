import * as types from 'actions/actionTypes';

const initialState = {
  activeId: null,
  isSharingDesktop: false,
  localStream: null,
  desktopStream: null,
  voiceStream: null, 
  mediaRecorder: null,
  recordedChunks: [],
};

export default function screenRecordingReducer(state = initialState, action) {
  const { type, payload = {} } = action;

  switch (type) {
    case types.START_SCREEN_RECORDING: {
      const { id, stream, desktopStream, voiceStream, mediaRecorder } = payload;
      return {
        ...state,
        activeId: id,
        isSharingDesktop: true,
        localStream: stream,
        desktopStream,
        voiceStream, 
        mediaRecorder,
      };
    }
    case types.ADD_SCREEN_RECORDING_CHUNK: {
      if (state.isSharingDesktop) {
        const { recordingChunk } = payload;
        return { ...state, recordedChunks: [...state.recordedChunks, recordingChunk] };
      }
    }
    case types.END_SCREEN_RECORDING: {
      return {
        ...state,
        activeId: null,
        isSharingDesktop: false,
        localStream: null,
        desktopStream: null, 
        voiceStream: null, 
        mediaRecorder: null,
        recordedChunks: [],
      };
    }

    default:
      return state;
  }
}

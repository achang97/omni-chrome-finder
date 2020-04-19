import moment from 'moment';
import * as types from 'actions/actionTypes';

const initialState = {
  activeId: null,
  isSharingDesktop: false,
  localStream: null,
  desktopStream: null,
  voiceStream: null, 
  mediaRecorder: null,
  recordedChunks: [],
  onSuccess: null,
  recording: null,
};

export default function screenRecordingReducer(state = initialState, action) {
  const { type, payload = {} } = action;

  switch (type) {
    case types.START_SCREEN_RECORDING: {
      const { id, stream, desktopStream, voiceStream, mediaRecorder, onSuccess } = payload;
      return {
        ...state,
        activeId: id,
        isSharingDesktop: true,
        localStream: stream,
        desktopStream,
        voiceStream, 
        mediaRecorder,
        onSuccess
      };
    }
    case types.ADD_SCREEN_RECORDING_CHUNK: {
      if (state.isSharingDesktop) {
        const { recordingChunk } = payload;
        return { ...state, recordedChunks: [...state.recordedChunks, recordingChunk] };
      }
    }
    case types.END_SCREEN_RECORDING: {
      const { recordedChunks, activeId } = state;

      const now = moment().format('DD.MM.YYYY HH:mm:ss');
      const recording = new File(recordedChunks, `Screen Recording ${now}.webm`, { type: 'video/webm' });

      return {
        ...state,
        isSharingDesktop: false,
        localStream: null,
        desktopStream: null, 
        voiceStream: null, 
        mediaRecorder: null,
        recordedChunks: [],
        recording
      };
    }
    case types.CLEAR_SCREEN_RECORDING: {
      return initialState;
    }

    default:
      return state;
  }
}

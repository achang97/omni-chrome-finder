import * as types from './actionTypes';

export function addScreenRecordingChunk(recordingChunk) {
  return { type: types.ADD_SCREEN_RECORDING_CHUNK, payload: { recordingChunk } };
}

export function startScreenRecording(stream, desktopStream, voiceStream, mediaRecorder) {
  return { type: types.START_SCREEN_RECORDING, payload: { stream, desktopStream, voiceStream, mediaRecorder } };
}

export function endScreenRecording() {
  return { type: types.END_SCREEN_RECORDING, payload: { } };
}

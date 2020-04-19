import * as types from './actionTypes';

export function addScreenRecordingChunk(recordingChunk) {
  return { type: types.ADD_SCREEN_RECORDING_CHUNK, payload: { recordingChunk } };
}

export function startScreenRecording({ id, stream, desktopStream, voiceStream, mediaRecorder, onSuccess }) {
  return { type: types.START_SCREEN_RECORDING, payload: { id, stream, desktopStream, voiceStream, mediaRecorder, onSuccess } };
}

export function endScreenRecording() {
  return { type: types.END_SCREEN_RECORDING, payload: { } };
}

export function clearScreenRecording() {
  return { type: types.CLEAR_SCREEN_RECORDING, payload: { } };
}
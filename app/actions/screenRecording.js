import * as types from './actionTypes';

export function addScreenRecordingChunk(recordingChunk) {
  return { type: types.ADD_SCREEN_RECORDING_CHUNK, payload: { recordingChunk } };
}

export function startScreenRecording(stream, mediaRecorder) {
  return { type: types.START_SCREEN_RECORDING, payload: { stream, mediaRecorder } };
}

export function endScreenRecording() {
  return { type: types.END_SCREEN_RECORDING, payload: { } };
}

export function handleScreenRecordingError(error) {
  return { type: types.SCREEN_RECORDING_ERROR, payload: { error } };
}

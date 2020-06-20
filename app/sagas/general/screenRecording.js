import { eventChannel, END } from 'redux-saga';
import { take, select, put, call, fork } from 'redux-saga/effects';
import moment from 'moment';
import {
  INIT_SCREEN_RECORDING,
  END_SCREEN_RECORDING,
  CLEAR_SCREEN_RECORDING
} from 'actions/actionTypes';
import {
  addScreenRecordingChunk,
  startScreenRecording,
  clearScreenRecording,
  endScreenRecording
} from 'actions/screenRecording';
import { toggleDock } from 'actions/display';

let desktopStream;
let voiceStream;
let combinedStream;
let mediaRecorder;

export default function* watchScreenRecordingActions() {
  while (true) {
    const action = yield take([
      INIT_SCREEN_RECORDING,
      END_SCREEN_RECORDING,
      CLEAR_SCREEN_RECORDING
    ]);

    const { type } = action;
    switch (type) {
      case INIT_SCREEN_RECORDING: {
        yield fork(initRecording);
        break;
      }
      case END_SCREEN_RECORDING: {
        yield fork(createScreenRecording);
        break;
      }
      case CLEAR_SCREEN_RECORDING: {
        const dockVisible = yield select((state) => state.display.dockVisible);
        if (!dockVisible) {
          yield put(toggleDock());
        }
        break;
      }

      default: {
        break;
      }
    }
  }
}

function* initRecording() {
  const dockVisible = yield select((state) => state.display.dockVisible);
  if (dockVisible) {
    yield put(toggleDock());
  }

  try {
    voiceStream = yield call(() =>
      navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false
      })
    );
  } catch (error) {
    // Do nothing
  }

  try {
    desktopStream = yield call(() =>
      navigator.mediaDevices.getDisplayMedia({
        audio: true,
        video: {
          width: { ideal: 4096 },
          height: { ideal: 2160 }
        }
      })
    );
  } catch (error) {
    yield put(clearScreenRecording());
    stopAllMedia();
    return;
  }

  yield fork(setUpDesktopStream);
  yield fork(startMediaRecorder);
  yield put(startScreenRecording());
}

function* setUpDesktopStream() {
  const desktopStreamChannel = yield call(createDesktopStreamChannel);

  try {
    while (true) yield take(desktopStreamChannel);
  } finally {
    stopAllMedia();
    const isSharingDesktop = yield select((state) => state.screenRecording.isSharingDesktop);

    // Check to see whether screen recording is still active, as "ending a screen recording"
    // can come from one of two places: the "End Screen Recording" button or "Stop Sharing."
    if (isSharingDesktop) {
      yield put(endScreenRecording());
    }
  }
}

function* startMediaRecorder() {
  const tracks = [
    ...desktopStream.getVideoTracks(),
    ...(voiceStream ? mergeAudioStreams(desktopStream, voiceStream) : [])
  ];

  combinedStream = new MediaStream(tracks);

  mediaRecorder = new MediaRecorder(combinedStream, {
    mimeType: `video/webm${voiceStream ? '; codecs=vp8,opus' : ''}`
  });

  const mediaRecorderChannel = yield call(createMediaRecorderChannel);
  mediaRecorder.start(10);

  while (true) {
    const event = yield take(mediaRecorderChannel);
    if (event.data && event.data.size > 0) {
      yield put(addScreenRecordingChunk(event.data));
    }
  }
}

function stopStream(stream) {
  if (stream) {
    stream.getTracks().forEach((track) => track.stop());
  }
}

function stopAllMedia() {
  stopStream(combinedStream);
  stopStream(desktopStream);
  stopStream(voiceStream);

  // Unset all values
  combinedStream = null;
  desktopStream = null;
  voiceStream = null;

  stopMediaRecorder();
}

function mergeAudioStreams() {
  const context = new AudioContext();
  const destination = context.createMediaStreamDestination();

  if (desktopStream && desktopStream.getAudioTracks().length > 0) {
    // If you don't want to share Audio from the desktop it should still work with just the voice.
    const source1 = context.createMediaStreamSource(desktopStream);
    const desktopGain = context.createGain();
    desktopGain.gain.value = 0.7;
    source1.connect(desktopGain).connect(destination);
  }

  if (voiceStream && voiceStream.getAudioTracks().length > 0) {
    const source2 = context.createMediaStreamSource(voiceStream);
    const voiceGain = context.createGain();
    voiceGain.gain.value = 0.7;
    source2.connect(voiceGain).connect(destination);
  }

  return destination.stream.getAudioTracks();
}

function createDesktopStreamChannel() {
  return eventChannel((emit) => {
    desktopStream.oninactive = () => {
      emit(END);
    };

    return () => {
      stopStream(desktopStream);
      desktopStream = null;
    };
  });
}

function createMediaRecorderChannel() {
  return eventChannel((emit) => {
    mediaRecorder.ondataavailable = (event) => {
      emit(event);
    };

    return stopMediaRecorder;
  });
}

function stopMediaRecorder() {
  if (mediaRecorder) {
    mediaRecorder.stop();
  }
  mediaRecorder = null;
}

function* createScreenRecording() {
  const { onSuccess, recordedChunks } = yield select((state) => state.screenRecording);

  stopAllMedia();

  const now = moment().format('DD.MM.YYYY HH:mm:ss');
  const recording = new File(recordedChunks, `Screen Recording ${now}.webm`, {
    type: 'video/webm'
  });

  onSuccess({ recording });
  yield put(clearScreenRecording());
}

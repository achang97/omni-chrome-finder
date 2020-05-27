import { take, select, put } from 'redux-saga/effects';
import { END_SCREEN_RECORDING, CLEAR_SCREEN_RECORDING } from 'actions/actionTypes';
import { clearScreenRecording } from 'actions/screenRecording';
import { toggleDock } from 'actions/display';

export default function* watchScreenRecordingActions() {
  while (true) {
    const action = yield take([END_SCREEN_RECORDING, CLEAR_SCREEN_RECORDING]);

    const { type } = action;
    switch (type) {
      case END_SCREEN_RECORDING: {
        const { recording, onSuccess } = yield select((state) => state.screenRecording);
        onSuccess({ recording });
        yield put(clearScreenRecording());
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
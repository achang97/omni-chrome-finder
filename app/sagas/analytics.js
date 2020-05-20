import { take, call, fork } from 'redux-saga/effects';
import { TRACK_EVENT } from 'actions/actionTypes';
import { doPost } from 'utils/request';

export default function* watchAnalyticsRequests() {
  while (true) {
    const action = yield take([TRACK_EVENT]);

    const { type, payload } = action;
    switch (type) {
      case TRACK_EVENT: {
        yield fork(trackEvent, payload);
        break;
      }
      default: {
        break;
      }
    }
  }
}

function* trackEvent({ event, properties }) {
  try {
    yield call(doPost, '/track', { event, properties });
  } catch (error) {
    /* TODO: Add Error Catching */
  }
}

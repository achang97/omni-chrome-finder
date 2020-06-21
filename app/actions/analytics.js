import * as types from './actionTypes';

export default function trackEvent(event, properties, isRetention = false) {
  return { type: types.TRACK_EVENT, payload: { event, properties, isRetention } };
}

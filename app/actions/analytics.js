import * as types from './actionTypes';

export default function trackEvent(event, properties) {
  return { type: types.TRACK_EVENT, payload: { event, properties } };
}

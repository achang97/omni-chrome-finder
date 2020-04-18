import * as types from 'actions/actionTypes';
import { clearScreenRecording } from 'actions/screenRecording';

const cardsMiddleware = store => next => (action) => {
  const nextAction = next(action);
  const { type, payload } = action;

  switch (type) {
    case types.END_SCREEN_RECORDING: {
      const { screenRecording: { recording, onSuccess, activeId } } =  store.getState();
      onSuccess({ recording });
      store.dispatch(clearScreenRecording());
      break;
    }
    default: {
      break;
    }
  }

  return nextAction;
};

export default cardsMiddleware;
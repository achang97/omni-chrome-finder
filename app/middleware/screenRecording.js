import * as types from 'actions/actionTypes';
import { clearScreenRecording } from 'actions/screenRecording';
import { toggleDock } from 'actions/display';

const cardsMiddleware = store => next => (action) => {
  const nextAction = next(action);
  const { type, payload } = action;

  switch (type) {
    case types.END_SCREEN_RECORDING: {
      const {
        screenRecording: { recording, onSuccess, activeId },
        display: { dockVisible }
      } = store.getState();

      onSuccess({ recording });
      store.dispatch(clearScreenRecording());

      if (!dockVisible) {
        store.dispatch(toggleDock());
      }
      break;
    }
    default: {
      break;
    }
  }

  return nextAction;
};

export default cardsMiddleware;
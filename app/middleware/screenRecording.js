import * as types from 'actions/actionTypes';
import { clearScreenRecording } from 'actions/screenRecording';
import { toggleDock, toggleDockHeight } from 'actions/display';

const cardsMiddleware = (store) => (next) => (action) => {
  const nextAction = next(action);
  const { type } = action;

  switch (type) {
    case types.END_SCREEN_RECORDING: {
      const {
        screenRecording: { recording, onSuccess }
      } = store.getState();

      onSuccess({ recording });
      store.dispatch(clearScreenRecording());
      break;
    }
    case types.CLEAR_SCREEN_RECORDING: {
      const {
        display: { dockVisible, dockExpanded }
      } = store.getState();

      if (!dockVisible) {
        store.dispatch(toggleDock());
      }

      // Expand in all cases (not technically accurate but ok for now)
      if (!dockExpanded) {
        store.dispatch(toggleDockHeight());
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

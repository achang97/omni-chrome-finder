import { setStorage, getStorage } from 'utils/storage';
import * as types from 'actions/actionTypes';
import { requestGetTasks } from 'actions/tasks';
import { CARD, CHROME } from 'appConstants';

const tasksMiddleware = store => next => (action) => {
  const nextAction = next(action);
  const { type, payload } = action;

  switch (type) {
    case types.LOGIN_SUCCESS:
    case types.ASK_QUESTION_SUCCESS:
    case types.MARK_OUT_OF_DATE_SUCCESS: {
      store.dispatch(requestGetTasks());
      break;
    }
    case types.GET_TASKS_SUCCESS: {
      const { tasks } = payload;
      setStorage(CHROME.STORAGE.TASKS, tasks);
      break;
    }
    case types.REMOVE_TASK: {
      const tasks = store.getState().tasks.tasks;
      setStorage(CHROME.STORAGE.TASKS, tasks);
      break;
    }
    case types.MARK_UP_TO_DATE_SUCCESS:
    case types.APPROVE_CARD_SUCCESS:
    case types.UPDATE_CARD_SUCCESS: {
      const { card } = payload;
      if (card.status === CARD.STATUS.UP_TO_DATE) {
        getStorage(CHROME.STORAGE.TASKS).then(tasks => {
          const newTasks = tasks.map(task => (task.card._id === card._id ? { ...task, resolved: true } : task));
          setStorage(CHROME.STORAGE.TASKS, newTasks);
        });   
      }   
      break;
    }
    case types.LOGOUT: {
      setStorage(CHROME.STORAGE.TASKS, []);
      break;
    }
    default: {
      break;
    }
  }

  return nextAction;
};

export default tasksMiddleware;
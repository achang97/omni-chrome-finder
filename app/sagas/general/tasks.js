import { take, put, select } from 'redux-saga/effects';
import {
  LOGIN_SUCCESS,
  ASK_QUESTION_SUCCESS,
  MARK_OUT_OF_DATE_SUCCESS,
  GET_TASKS_SUCCESS,
  REMOVE_TASK,
  DELETE_FINDER_NODES_SUCCESS,
  DELETE_CARD_SUCCESS,
  MARK_UP_TO_DATE_SUCCESS,
  APPROVE_CARD_SUCCESS,
  UPDATE_CARD_SUCCESS,
  LOGOUT
} from 'actions/actionTypes';
import { setStorage, getStorage } from 'utils/storage';
import { requestGetTasks } from 'actions/tasks';
import { CARD, CHROME } from 'appConstants';

const removeTask = (cardId) => {
  getStorage(CHROME.STORAGE.TASKS).then((tasks) => {
    const newTasks = tasks.map((task) =>
      task.card._id === cardId ? { ...task, resolved: true } : task
    );
    setStorage(CHROME.STORAGE.TASKS, newTasks);
  });
};

export default function* watchTaskActions() {
  while (true) {
    const action = yield take([
      LOGIN_SUCCESS,
      ASK_QUESTION_SUCCESS,
      MARK_OUT_OF_DATE_SUCCESS,
      GET_TASKS_SUCCESS,
      REMOVE_TASK,
      DELETE_FINDER_NODES_SUCCESS,
      DELETE_CARD_SUCCESS,
      MARK_UP_TO_DATE_SUCCESS,
      APPROVE_CARD_SUCCESS,
      UPDATE_CARD_SUCCESS,
      LOGOUT
    ]);

    const { type, payload } = action;
    switch (type) {
      case LOGIN_SUCCESS:
      case ASK_QUESTION_SUCCESS:
      case MARK_OUT_OF_DATE_SUCCESS: {
        yield put(requestGetTasks());
        break;
      }
      case GET_TASKS_SUCCESS: {
        const { tasks } = payload;
        setStorage(CHROME.STORAGE.TASKS, tasks);
        break;
      }
      case REMOVE_TASK: {
        const tasks = yield select((state) => state.tasks.tasks);
        setStorage(CHROME.STORAGE.TASKS, tasks);
        break;
      }

      case DELETE_FINDER_NODES_SUCCESS: {
        const { cardIds } = payload;
        cardIds.forEach((cardId) => removeTask(cardId));
        break;
      }
      case DELETE_CARD_SUCCESS: {
        const { cardId } = payload;
        removeTask(cardId);
        break;
      }
      case MARK_UP_TO_DATE_SUCCESS:
      case APPROVE_CARD_SUCCESS:
      case UPDATE_CARD_SUCCESS: {
        const { card } = payload;
        if (card.status === CARD.STATUS.UP_TO_DATE) {
          removeTask(card._id);
        }
        break;
      }
      case LOGOUT: {
        setStorage(CHROME.STORAGE.TASKS, []);
        break;
      }
      default: {
        break;
      }
    }
  }
}

import { take, put, all, select } from 'redux-saga/effects';
import {
  MARK_UP_TO_DATE_FROM_TASKS_SUCCESS,
  APPROVE_CARD_FROM_TASKS_SUCCESS,
  UPDATE_CARD_SUCCESS,
  MARK_OUT_OF_DATE_SUCCESS,
  MARK_UP_TO_DATE_SUCCESS,
  APPROVE_CARD_SUCCESS,
  GET_CARD_SUCCESS,
  DELETE_CARD_SUCCESS,
  CLOSE_CARD,
  CANCEL_EDIT_CARD,
  DELETE_FINDER_NODES_SUCCESS,
  MOVE_FINDER_NODES_SUCCESS
} from 'actions/actionTypes';
import { updateCard, handleDeleteCardSuccess, requestGetCard } from 'actions/cards';
import { requestGetRecentCards } from 'actions/ask';
import { requestGetExternalCard } from 'actions/externalVerification';
import { closeFinder, updateFinderNode } from 'actions/finder';
import { MAIN_STATE_ID } from 'appConstants/finder';

export default function* watchCardActions() {
  while (true) {
    const action = yield take([
      MARK_UP_TO_DATE_FROM_TASKS_SUCCESS,
      APPROVE_CARD_FROM_TASKS_SUCCESS,
      DELETE_FINDER_NODES_SUCCESS,
      CLOSE_CARD,
      CANCEL_EDIT_CARD,
      UPDATE_CARD_SUCCESS,
      MARK_OUT_OF_DATE_SUCCESS,
      MARK_UP_TO_DATE_SUCCESS,
      APPROVE_CARD_SUCCESS,
      GET_CARD_SUCCESS,
      DELETE_CARD_SUCCESS,
      DELETE_FINDER_NODES_SUCCESS,
      MOVE_FINDER_NODES_SUCCESS
    ]);

    const { type, payload } = action;
    switch (type) {
      // Handle tasks actions
      case MARK_UP_TO_DATE_FROM_TASKS_SUCCESS:
      case APPROVE_CARD_FROM_TASKS_SUCCESS: {
        const { card } = payload;
        yield put(updateCard(card));
        yield put(requestGetExternalCard());
        yield put(updateFinderNode(card));
        break;
      }

      // Handle finder deletion actions
      case DELETE_FINDER_NODES_SUCCESS: {
        const { cardIds } = payload;
        yield all(cardIds.map((cardId) => put(handleDeleteCardSuccess(cardId))));
        yield put(requestGetRecentCards());
        yield put(requestGetExternalCard());
        break;
      }
      case MOVE_FINDER_NODES_SUCCESS: {
        yield put(requestGetRecentCards());
        break;
      }

      // Handle actions from card itself
      case UPDATE_CARD_SUCCESS:
      case MARK_OUT_OF_DATE_SUCCESS:
      case MARK_UP_TO_DATE_SUCCESS:
      case APPROVE_CARD_SUCCESS:
      case GET_CARD_SUCCESS:
      case DELETE_CARD_SUCCESS: {
        yield put(requestGetRecentCards());
        yield put(requestGetExternalCard());
        break;
      }

      case CLOSE_CARD: {
        const {
          cards: { cards },
          finder
        } = yield select((state) => state);

        const cardIds = cards.map(({ _id }) => _id);
        const finderIds = Object.keys(finder);

        yield all(
          finderIds
            .filter((finderId) => finderId !== MAIN_STATE_ID && !cardIds.includes(finderId))
            .map((finderId) => put(closeFinder(finderId)))
        );
        break;
      }
      case CANCEL_EDIT_CARD: {
        yield put(requestGetCard());
        break;
      }
      default: {
        break;
      }
    }
  }
}

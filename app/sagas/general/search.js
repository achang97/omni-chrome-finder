import { take, put, select } from 'redux-saga/effects';
import {
  UPDATE_CARD_SUCCESS,
  MARK_OUT_OF_DATE_SUCCESS,
  MARK_UP_TO_DATE_SUCCESS,
  MARK_UP_TO_DATE_FROM_TASKS_SUCCESS,
  UPDATE_FINDER_FOLDER_SUCCESS,
  DELETE_CARD_SUCCESS,
  DELETE_FINDER_NODES_SUCCESS,
  CREATE_EXTERNAL_CARD_SUCCESS
} from 'actions/actionTypes';
import {
  updateSearchCard,
  removeSearchCards,
  removeSearchNodes,
  updateSearchNode,
  updateSearchIntegrationResult
} from 'actions/search';

export default function* watchSearchActions() {
  while (true) {
    const action = yield take([
      UPDATE_CARD_SUCCESS,
      MARK_OUT_OF_DATE_SUCCESS,
      MARK_UP_TO_DATE_SUCCESS,
      MARK_UP_TO_DATE_FROM_TASKS_SUCCESS,
      UPDATE_FINDER_FOLDER_SUCCESS,
      DELETE_CARD_SUCCESS,
      DELETE_FINDER_NODES_SUCCESS,
      CREATE_EXTERNAL_CARD_SUCCESS
    ]);

    const { type, payload } = action;
    switch (type) {
      // Update cards
      case UPDATE_CARD_SUCCESS:
      case MARK_OUT_OF_DATE_SUCCESS:
      case MARK_UP_TO_DATE_SUCCESS:
      case MARK_UP_TO_DATE_FROM_TASKS_SUCCESS: {
        const { card } = payload;
        yield put(updateSearchCard(card));
        break;
      }

      case UPDATE_FINDER_FOLDER_SUCCESS: {
        const { folder } = payload;
        yield put(updateSearchNode(folder));
        break;
      }

      // Remove cards
      case DELETE_CARD_SUCCESS: {
        const { cardId } = payload;
        yield put(removeSearchCards([cardId]));
        break;
      }
      case DELETE_FINDER_NODES_SUCCESS: {
        const { cardIds, nodeIds } = payload;
        yield put(removeSearchCards(cardIds));
        yield put(removeSearchNodes(nodeIds));
        break;
      }

      // Update Integration Results
      // TODO: Handle deletion and status update of corresponding card
      case CREATE_EXTERNAL_CARD_SUCCESS: {
        const { card } = payload;
        const {
          externalLinkAnswer: { type: integrationType },
          resultId
        } = yield select((state) => state.externalVerification);
        yield put(
          updateSearchIntegrationResult(integrationType, { 'commonProps.id': resultId }, { card })
        );
        break;
      }

      default: {
        break;
      }
    }
  }
}

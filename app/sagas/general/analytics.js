import { take, put, select } from 'redux-saga/effects';
import {
  TOGGLE_DOCK,
  EDIT_CARD,
  TOGGLE_UPVOTE_SUCCESS,
  OPEN_FINDER,
  TOGGLE_EXTERNAL_CREATE_MODAL,
  CREATE_EXTERNAL_CARD_SUCCESS
} from 'actions/actionTypes';
import { EVENT } from 'appConstants/segment';
import trackEvent from 'actions/analytics';

function getCardProperties(card) {
  const { _id, question, status } = card;
  return { 'Card ID': _id, Question: question, Status: status };
}

function getExternalCardProperties(card) {
  const { _id, question, status, externalLinkAnswer } = card;
  const { type } = externalLinkAnswer;
  return { 'Card ID': _id, Question: question, Status: status, Type: type };
}

export default function* watchAnalyticsActions() {
  while (true) {
    const action = yield take([
      TOGGLE_DOCK,
      EDIT_CARD,
      TOGGLE_UPVOTE_SUCCESS,
      OPEN_FINDER,
      TOGGLE_EXTERNAL_CREATE_MODAL,
      CREATE_EXTERNAL_CARD_SUCCESS
    ]);

    const isLoggedIn = yield select((state) => state.auth.token);
    if (isLoggedIn) {
      const { type, payload } = action;

      let event;
      let properties;

      switch (type) {
        case TOGGLE_DOCK: {
          const dockVisible = yield select((state) => state.display.dockVisible);
          if (dockVisible) {
            event = EVENT.OPEN_EXTENSION;
          }
          break;
        }
        // Cards
        case EDIT_CARD: {
          const activeCard = yield select((state) => state.cards.activeCard);
          event = EVENT.CLICK_EDIT_CARD;
          properties = getCardProperties(activeCard);
          break;
        }
        case TOGGLE_UPVOTE_SUCCESS: {
          const userId = yield select((state) => state.profile.user._id);
          const { card } = payload;
          properties = getCardProperties(card);

          if (!card.upvotes.some(({ _id }) => _id === userId)) {
            event = EVENT.UNMARK_CARD_HELPFUL;
          } else {
            event = EVENT.MARK_CARD_HELPFUL;
          }
          break;
        }

        // Finder
        case OPEN_FINDER: {
          event = EVENT.OPEN_FINDER;
          break;
        }

        case TOGGLE_EXTERNAL_CREATE_MODAL: {
          const isCreateModalOpen = yield select(
            (state) => state.externalVerification.isCreateModalOpen
          );
          if (isCreateModalOpen) event = EVENT.CLICK_VERIFY_EXTERNAL_KNOWLEDGE;
          break;
        }
        case CREATE_EXTERNAL_CARD_SUCCESS: {
          const { card } = payload;
          properties = getExternalCardProperties(card);
          event = EVENT.CREATE_EXTERNAL_CARD;
          break;
        }

        default: {
          break;
        }
      }

      if (event) {
        yield put(trackEvent(event, properties || {}));
      }
    }
  }
}

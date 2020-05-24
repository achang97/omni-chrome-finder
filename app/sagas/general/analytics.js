import { take, put, select } from 'redux-saga/effects';
import { EDIT_CARD, TOGGLE_UPVOTE_SUCCESS, OPEN_FINDER } from 'actions/actionTypes';
import trackEvent from 'actions/analytics';

function getCardProperties(card) {
  const { _id, question, status } = card;
  return { 'Card ID': _id, Question: question, Status: status };
}

export default function* watchAnalyticsActions() {
  while (true) {
    const action = yield take([EDIT_CARD, TOGGLE_UPVOTE_SUCCESS, OPEN_FINDER]);

    const { type, payload } = action;

    let event;
    let properties;

    switch (type) {
      // Cards
      case EDIT_CARD: {
        const activeCard = yield select((state) => state.cards.activeCard);
        event = 'Click Edit Card';
        properties = getCardProperties(activeCard);
        break;
      }
      case TOGGLE_UPVOTE_SUCCESS: {
        const userId = yield select((state) => state.profile.user._id);
        const { card } = payload;
        properties = getCardProperties(card);

        if (!card.upvotes.some(({ _id }) => _id === userId)) {
          event = 'Unmark Card Helpful';
        } else {
          event = 'Mark Card Helpful';
        }
        break;
      }

      // Finder
      case OPEN_FINDER: {
        event = 'Open Finder';
        break;
      }

      default: {
        break;
      }
    }

    if (event) {
      yield put(trackEvent(event, properties));
    }
  }
}

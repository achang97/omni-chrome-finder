import { take, call, fork, select, put } from 'redux-saga/effects';
import { doGet, doPost, getErrorMessage } from 'utils/request';
import { getArrayIds } from 'utils/array';
import { STATUS } from 'appConstants/card';
import { GET_EXTERNAL_CARD_REQUEST, CREATE_EXTERNAL_CARD_REQUEST } from 'actions/actionTypes';
import {
  handleGetExternalCardSuccess,
  handleGetExternalCardError,
  handleCreateExternalCardSuccess,
  handleCreateExternalCardError
} from 'actions/externalVerification';

export default function* watchExternalVerificationRequests() {
  while (true) {
    const action = yield take([GET_EXTERNAL_CARD_REQUEST, CREATE_EXTERNAL_CARD_REQUEST]);

    const { type } = action;
    switch (type) {
      case GET_EXTERNAL_CARD_REQUEST: {
        yield fork(getCard);
        break;
      }
      case CREATE_EXTERNAL_CARD_REQUEST: {
        yield fork(createCard);
        break;
      }
      default: {
        break;
      }
    }
  }
}

function* getCard() {
  try {
    const link = yield select((state) => state.externalVerification.activeIntegration.links.link);
    const card = yield call(doGet, '/cards/byExternalLink', { link });
    yield put(handleGetExternalCardSuccess(card));
  } catch (error) {
    yield put(handleGetExternalCardError(getErrorMessage(error)));
  }
}

function* createCard() {
  try {
    const { title, owners, verificationInterval, finderNode, externalLinkAnswer } = yield select(
      (state) => state.externalVerification
    );
    const newCardInfo = {
      question: title,
      externalLinkAnswer,
      owners: getArrayIds(owners),
      subscribers: getArrayIds(owners),
      finderNode: finderNode && finderNode._id,
      updateInterval: verificationInterval.value,
      status: STATUS.UP_TO_DATE
    };
    const newCard = yield call(doPost, '/cards', newCardInfo);
    yield put(handleCreateExternalCardSuccess(newCard));
  } catch (error) {
    yield put(handleCreateExternalCardError(getErrorMessage(error)));
  }
}

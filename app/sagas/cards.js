import { delay } from 'redux-saga';
import _ from 'underscore';
import { take, call, fork, all, cancel, cancelled, put, select } from 'redux-saga/effects';
import { doGet, doPost, doPut, doDelete } from '../utils/request'
import { getArrayIds, getArrayField } from '../utils/arrayHelpers';
import { getContentStateFromEditorState } from '../utils/editorHelpers';
import { toggleUpvotes } from '../utils/cardHelpers';
import { CARD_STATUS, PERMISSION_OPTION, AUTO_REMIND_VALUE } from '../utils/constants';
import { GET_CARD_REQUEST, CREATE_CARD_REQUEST, UPDATE_CARD_REQUEST, TOGGLE_UPVOTE_REQUEST, DELETE_CARD_REQUEST, MARK_UP_TO_DATE_REQUEST, MARK_OUT_OF_DATE_REQUEST } from '../actions/actionTypes';
import { 
  handleGetCardSuccess, handleGetCardError,
  handleCreateCardSuccess, handleCreateCardError,
  handleUpdateCardSuccess, handleUpdateCardError,
  handleDeleteCardSuccess, handleDeleteCardError,
  handleToggleUpvoteSuccess, handleToggleUpvoteError,
  handleMarkUpToDateSuccess, handleMarkUpToDateError,
  handleMarkOutOfDateSuccess, handleMarkOutOfDateError,
} from '../actions/cards';

export default function* watchCardsRequests() {
  let action;

  while (action = yield take([GET_CARD_REQUEST, CREATE_CARD_REQUEST, UPDATE_CARD_REQUEST, TOGGLE_UPVOTE_REQUEST, DELETE_CARD_REQUEST, MARK_UP_TO_DATE_REQUEST, MARK_OUT_OF_DATE_REQUEST])) {
    const { type, payload } = action;
    switch (type) {
      case GET_CARD_REQUEST: {
        yield fork(getCard);
        break;
      }
      case CREATE_CARD_REQUEST: {
        yield fork(createCard);
        break;
      }
      case UPDATE_CARD_REQUEST: {
        yield fork(updateCard, payload);
        break;
      }
      case DELETE_CARD_REQUEST: {
        yield fork(deleteCard);
        break;
      }
      case TOGGLE_UPVOTE_REQUEST: {
        yield fork(toggleUpvote, payload);
        break;
      }
      case MARK_UP_TO_DATE_REQUEST: {
        yield fork(markUpToDate);
        break;
      }
      case MARK_OUT_OF_DATE_REQUEST: {
        yield fork(markOutOfDate);
        break;
      }
    }
  }
}

function* getActiveCardId() {
  const cardId = yield select(state => state.cards.activeCard._id);
  return cardId;
}

function* getCard() {
  const cardId = yield call(getActiveCardId);
  try {
    const card = yield call(doGet, `/cards/${cardId}`);
    yield put(handleGetCardSuccess(cardId, card));
  } catch(error) {
    console.log(error)
    const { response: { data } } = error;
    yield put(handleGetCardError(cardId, data.error));
  }
}

function* getUserId() {
  const _id = yield select(state => state.auth.user._id);
  return _id;
}

function* convertCardToBackendFormat(isNewCard) {
  const { question, answerEditorState, descriptionEditorState, owners, tags, keywords, verificationInterval, permissions, permissionGroups, cardStatus, /*, attachments, messages */ } = yield select(state => state.cards.activeCard.edits);
  const _id = yield call(getUserId);

  const { contentState: descriptionContentState, text: descriptionText } = getContentStateFromEditorState(descriptionEditorState);
  const { contentState: answerContentState, text: answerText } = getContentStateFromEditorState(answerEditorState);

  const verificationInfo = { autoupdate: verificationInterval.value === AUTO_REMIND_VALUE };
  if (!verificationInfo.autoupdate) {
    verificationInfo.update_interval = verificationInterval.value;
  }

  const permissionsInfo = {
    user_permissions: permissions.value === PERMISSION_OPTION.JUST_ME ? [_id] : [],
    permission_groups: permissions.value === PERMISSION_OPTION.SPECIFIC_GROUPS ? permissionGroups : [],
  }

  return {
    question,
    description: descriptionText,
    content_state_description: descriptionContentState,
    answer: answerText,
    content_state_answer: answerContentState,
    owners: getArrayIds(owners),
    tags:  getArrayIds(tags),
    keywords: getArrayField(keywords, 'value'),
    ...verificationInfo,
    ...permissionsInfo,
    status: isNewCard ? CARD_STATUS.UP_TO_DATE : cardStatus,
  }
}

function* createCard() {
  const cardId = yield call(getActiveCardId);
  const newCardInfo = yield call(convertCardToBackendFormat, true);

  try {
    const card = yield call(doPost, '/cards', newCardInfo);
    yield put(handleCreateCardSuccess(cardId, card));
  } catch(error) {
    const { response: { data } } = error;
    yield put(handleCreateCardError(cardId, data.error));
  }
}

function* updateCard({ closeCard }) {
  const cardId = yield call(getActiveCardId);
  const newCardInfo = yield call(convertCardToBackendFormat, false);

  try {
    const card = yield call(doPut, `/cards/${cardId}`, newCardInfo);
    yield put(handleUpdateCardSuccess(card, closeCard));
  } catch(error) {
    const { response: { data } } = error;
    yield put(handleUpdateCardError(cardId, data.error, closeCard));
  }
}

function* deleteCard() {
  const cardId = yield call(getActiveCardId);

  try {
    yield call(doDelete, `/cards/${cardId}`);
    yield put(handleDeleteCardSuccess(cardId));
  } catch(error) {
    const { response: { data } } = error;
    yield put(handleDeleteCardError(cardId, data.error));
  }
}

function* toggleUpvote({ upvotes }) {
  const cardId = yield call(getActiveCardId);
  const userId = yield call(getUserId);

  const oldUpvotes = toggleUpvotes(upvotes, userId);
  try {
    const card = yield call(doPut, `/cards/${cardId}`, { upvotes });
    yield put(handleToggleUpvoteSuccess(card));
  } catch(error) {
    const { response: { data } } = error;
    yield put(handleToggleUpvoteError(cardId, data.error, oldUpvotes));
  }
}

function* markUpToDate() {
  const cardId = yield call(getActiveCardId);
  try {
    const { updatedCard } = yield call(doPost, '/cards/uptodate', { cardId });
    yield put(handleMarkUpToDateSuccess(updatedCard));
  } catch(error) {
    const { response: { data } } = error;
    yield put(handleMarkUpToDateError(cardId, data.error));
  }  
}

function* markOutOfDate() {
  const cardId = yield call(getActiveCardId);
  try {
    const { updatedCard } = yield call(doPost, '/cards/outofdate', { cardId });
    yield put(handleMarkOutOfDateSuccess(updatedCard));
  } catch(error) {
    const { response: { data } } = error;
    yield put(handleMarkOutOfDateError(cardId, data.error));
  }  
}


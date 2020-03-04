import { delay } from 'redux-saga';
import _ from 'underscore';
import { take, call, fork, all, cancel, cancelled, put, select } from 'redux-saga/effects';
import { doGet, doPost, doPut, doDelete } from '../utils/request'
import { getArrayIds, getArrayField } from '../utils/arrayHelpers';
import { getContentStateFromEditorState } from '../utils/editorHelpers';
import { toggleUpvotes, isValidCard } from '../utils/cardHelpers';
import { convertAttachmentsToBackendFormat } from '../utils/fileHelpers';
import { CARD_STATUS, PERMISSION_OPTION, AUTO_REMIND_VALUE } from '../utils/constants';
import { GET_CARD_REQUEST, CREATE_CARD_REQUEST, UPDATE_CARD_REQUEST, TOGGLE_UPVOTE_REQUEST, DELETE_CARD_REQUEST, MARK_UP_TO_DATE_REQUEST, MARK_OUT_OF_DATE_REQUEST, ADD_BOOKMARK_REQUEST, REMOVE_BOOKMARK_REQUEST, ADD_CARD_ATTACHMENT_REQUEST } from '../actions/actionTypes';
import { 
  handleGetCardSuccess, handleGetCardError,
  handleCreateCardSuccess, handleCreateCardError,
  handleUpdateCardSuccess, handleUpdateCardError,
  handleDeleteCardSuccess, handleDeleteCardError,
  handleToggleUpvoteSuccess, handleToggleUpvoteError,
  handleMarkUpToDateSuccess, handleMarkUpToDateError,
  handleMarkOutOfDateSuccess, handleMarkOutOfDateError,
  handleAddBookmarkSuccess, handleAddBookmarkError,
  handleRemoveBookmarkSuccess, handleRemoveBookmarkError,
  handleAddCardAttachmentSuccess, handleAddCardAttachmentError,
} from '../actions/cards';

const INCOMPLETE_CARD_ERROR = 'Failed to save card: some fields are incomplete.';

export default function* watchCardsRequests() {
  let action;

  while (action = yield take([GET_CARD_REQUEST, CREATE_CARD_REQUEST, UPDATE_CARD_REQUEST, TOGGLE_UPVOTE_REQUEST, DELETE_CARD_REQUEST, MARK_UP_TO_DATE_REQUEST, MARK_OUT_OF_DATE_REQUEST, ADD_BOOKMARK_REQUEST, REMOVE_BOOKMARK_REQUEST, ADD_CARD_ATTACHMENT_REQUEST])) {
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
      case ADD_BOOKMARK_REQUEST: {
        yield fork(addBookmark, payload);
        break;
      }
      case REMOVE_BOOKMARK_REQUEST: {
        yield fork(removeBookmark, payload);
        break;
      }
      case ADD_CARD_ATTACHMENT_REQUEST: {
        yield fork(addAttachment, payload);
        break;
      }
    }
  }
}

function* getActiveCardId() {
  const cardId = yield select(state => state.cards.activeCard._id);
  return cardId;
}

function* getActiveCard() {
  const card = yield select(state => state.cards.activeCard);
  return card;
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
  const _id = yield select(state => state.profile.user._id);
  return _id;
}

function* convertCardToBackendFormat(isNewCard) {
  const { question, answerEditorState, descriptionEditorState, owners, tags, keywords, verificationInterval, permissions, permissionGroups, cardStatus, slackReplies, attachments } = yield select(state => state.cards.activeCard.edits);
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
    tags:  tags,
    keywords: getArrayField(keywords, 'value'),
    slackReplies: slackReplies.filter(({ selected }) => selected),
    attachments: convertAttachmentsToBackendFormat(attachments),
    ...verificationInfo,
    ...permissionsInfo,
    status: isNewCard ? CARD_STATUS.UP_TO_DATE : cardStatus,
  }
}

function* createCard() {
  const activeCard = yield call(getActiveCard);
  const cardId = activeCard._id;
  
  try {
    if (isValidCard(activeCard)) {
      const newCardInfo = yield call(convertCardToBackendFormat, true);
      const card = yield call(doPost, '/cards', newCardInfo);
      yield put(handleCreateCardSuccess(cardId, card));      
    } else {
      yield put(handleUpdateCardError(cardId, INCOMPLETE_CARD_ERROR));
    }
  } catch(error) {
    const { response: { data } } = error;
    yield put(handleCreateCardError(cardId, data.error));
  }
}

function* updateCard({ isUndocumented, closeCard }) {
  const activeCard = yield call(getActiveCard);
  const cardId = activeCard._id;

  try {
    if (isValidCard(activeCard)) {
      const newCardInfo = yield call(convertCardToBackendFormat, isUndocumented);
      const card = yield call(doPut, `/cards/${cardId}`, newCardInfo);
      yield put(handleUpdateCardSuccess(card, closeCard));
    } else {
      yield put(handleUpdateCardError(cardId, INCOMPLETE_CARD_ERROR, closeCard));
    }
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
  const reason = yield select(state => state.cards.activeCard.outOfDateReasonInput);

  try {
    const { updatedCard } = yield call(doPost, '/cards/outofdate', { cardId, reason });
    yield put(handleMarkOutOfDateSuccess(updatedCard));
  } catch(error) {
    const { response: { data } } = error;
    yield put(handleMarkOutOfDateError(cardId, data.error));
  }  
}

function* addBookmark({ cardId }) {
  try {
    yield call(doPost, `/cards/${cardId}/bookmark`);
    yield put(handleAddBookmarkSuccess(cardId));
  } catch(error) {
    const { response: { data } } = error;
    yield put(handleAddBookmarkError(cardId, data.error));
  }
}

function* removeBookmark({ cardId }) {
  try {
    yield call(doPost, `/cards/${cardId}/bookmark/remove`);
    yield put(handleRemoveBookmarkSuccess(cardId));
  } catch(error) {
    const { response: { data } } = error;
    yield put(handleRemoveBookmarkError(cardId, data.error));
  }
}

function* addAttachment({ key, file }) {
  const cardId = yield call(getActiveCardId);

  try {
    const formData = new FormData();
    formData.append('file', file);

    const attachment = yield call(doPost, '/files/upload', formData, true);
    yield put(handleAddCardAttachmentSuccess(cardId, key, attachment));
  } catch(error) {
    const { response: { data } } = error;
    yield put(handleAddCardAttachmentError(cardId, key, data.error));
  }  
}



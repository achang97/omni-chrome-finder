import _ from 'lodash';
import { take, call, fork, put, select } from 'redux-saga/effects';
import { doGet, doPost, doPut, doDelete, getErrorMessage } from 'utils/request';
import { getArrayIds } from 'utils/array';
import { getContentStateFromEditorState } from 'utils/editor';
import {
  toggleUpvotes,
  convertPermissionsToBackendFormat,
  hasValidEdits,
  isApprover,
  isExternalCard
} from 'utils/card';
import { convertAttachmentsToBackendFormat } from 'utils/file';
import { STATUS, PERMISSION_OPTION, VERIFICATION_INTERVAL_OPTION } from 'appConstants/card';
import { ROOT } from 'appConstants/finder';
import {
  GET_CARD_REQUEST,
  CREATE_CARD_REQUEST,
  UPDATE_CARD_REQUEST,
  TOGGLE_UPVOTE_REQUEST,
  DELETE_CARD_REQUEST,
  MARK_UP_TO_DATE_REQUEST,
  MARK_OUT_OF_DATE_REQUEST,
  APPROVE_CARD_REQUEST,
  ADD_BOOKMARK_REQUEST,
  REMOVE_BOOKMARK_REQUEST,
  ADD_CARD_ATTACHMENT_REQUEST,
  GET_SLACK_THREAD_REQUEST
} from 'actions/actionTypes';
import {
  handleGetCardSuccess,
  handleGetCardError,
  handleCreateCardSuccess,
  handleCreateCardError,
  handleUpdateCardSuccess,
  handleUpdateCardError,
  handleDeleteCardSuccess,
  handleDeleteCardError,
  handleToggleUpvoteSuccess,
  handleToggleUpvoteError,
  handleMarkUpToDateSuccess,
  handleMarkUpToDateError,
  handleMarkOutOfDateSuccess,
  handleMarkOutOfDateError,
  handleApproveCardSuccess,
  handleApproveCardError,
  handleAddBookmarkSuccess,
  handleAddBookmarkError,
  handleRemoveBookmarkSuccess,
  handleRemoveBookmarkError,
  handleAddCardAttachmentSuccess,
  handleAddCardAttachmentError,
  handleGetSlackThreadSuccess,
  handleGetSlackThreadError
} from 'actions/cards';

const INCOMPLETE_CARD_ERROR = 'Failed to save card: some fields are incomplete.';

export default function* watchCardsRequests() {
  while (true) {
    const action = yield take([
      GET_CARD_REQUEST,
      CREATE_CARD_REQUEST,
      UPDATE_CARD_REQUEST,
      TOGGLE_UPVOTE_REQUEST,
      DELETE_CARD_REQUEST,
      MARK_UP_TO_DATE_REQUEST,
      APPROVE_CARD_REQUEST,
      MARK_OUT_OF_DATE_REQUEST,
      ADD_BOOKMARK_REQUEST,
      REMOVE_BOOKMARK_REQUEST,
      ADD_CARD_ATTACHMENT_REQUEST,
      GET_SLACK_THREAD_REQUEST
    ]);

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
      case APPROVE_CARD_REQUEST: {
        yield fork(approveCard);
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
      case GET_SLACK_THREAD_REQUEST: {
        yield fork(getSlackThread);
        break;
      }
      default: {
        break;
      }
    }
  }
}

function* getActiveCardId() {
  const cardId = yield select((state) => state.cards.activeCard._id);
  return cardId;
}

function* getActiveCard() {
  const card = yield select((state) => state.cards.activeCard);
  return card;
}

function* getCard() {
  const cardId = yield call(getActiveCardId);
  try {
    const card = yield call(doGet, `/cards/${cardId}`);
    yield put(handleGetCardSuccess(cardId, card));
  } catch (error) {
    yield put(
      handleGetCardError(cardId, {
        status: _.get(error, 'response.status'),
        message: getErrorMessage(error)
      })
    );
  }
}

function* getUserId() {
  const _id = yield select((state) => state.profile.user._id);
  return _id;
}

function* convertCardToBackendFormat(isNewCard) {
  const {
    status,
    edits: {
      question,
      answerEditorState,
      owners,
      subscribers,
      tags,
      verificationInterval,
      permissions,
      permissionGroups,
      slackReplies,
      attachments,
      finderNode
    }
  } = yield select((state) => state.cards.activeCard);
  const _id = yield call(getUserId);

  const { contentState: contentStateAnswer, text: answerText } = getContentStateFromEditorState(
    answerEditorState
  );

  const permissionsInfo = convertPermissionsToBackendFormat(_id, permissions, permissionGroups);

  let cardOwners = getArrayIds(owners);
  let cardSubscribers = _.union(cardOwners, getArrayIds(subscribers));
  let cardTags = tags;
  let cardSlackReplies = slackReplies.filter(({ selected }) => selected);
  let cardUpdateInterval = verificationInterval.value;

  if (permissions.value === PERMISSION_OPTION.JUST_ME) {
    cardOwners = [_id];
    cardSubscribers = [_id];
    cardTags = [];
    cardSlackReplies = [];
    cardUpdateInterval = VERIFICATION_INTERVAL_OPTION.NEVER;
  }

  let finderNodeId = null;
  if (finderNode && finderNode._id !== ROOT.ID) {
    finderNodeId = finderNode._id;
  }

  return {
    question,
    answer: answerText,
    contentStateAnswer,
    attachments: convertAttachmentsToBackendFormat(attachments),
    ...permissionsInfo,
    owners: cardOwners,
    subscribers: cardSubscribers,
    tags: cardTags,
    slackReplies: cardSlackReplies,
    updateInterval: cardUpdateInterval,
    status: isNewCard ? STATUS.UP_TO_DATE : status,
    finderNode: finderNodeId
  };
}

function* createCard() {
  const activeCard = yield call(getActiveCard);
  const cardId = activeCard._id;

  try {
    if (hasValidEdits(activeCard.edits)) {
      const newCardInfo = yield call(convertCardToBackendFormat, true);
      const card = yield call(doPost, '/cards', newCardInfo);
      yield put(handleCreateCardSuccess(cardId, card));
    } else {
      yield put(handleUpdateCardError(cardId, INCOMPLETE_CARD_ERROR));
    }
  } catch (error) {
    yield put(handleCreateCardError(cardId, getErrorMessage(error)));
  }
}

function* updateCard({ shouldCloseCard }) {
  const activeCard = yield call(getActiveCard);
  const cardId = activeCard._id;
  const isExternal = isExternalCard(activeCard);

  try {
    if (hasValidEdits(activeCard.edits, isExternal)) {
      const newCardInfo = yield call(
        convertCardToBackendFormat,
        activeCard.status === STATUS.NOT_DOCUMENTED
      );
      const card = yield call(doPut, `/cards/${cardId}`, newCardInfo);
      const user = yield select((state) => state.profile.user);
      yield put(handleUpdateCardSuccess(card, shouldCloseCard, isApprover(user, card.tags)));
    } else {
      yield put(handleUpdateCardError(cardId, INCOMPLETE_CARD_ERROR, shouldCloseCard));
    }
  } catch (error) {
    yield put(handleUpdateCardError(cardId, getErrorMessage(error), shouldCloseCard));
  }
}

function* deleteCard() {
  const cardId = yield call(getActiveCardId);

  try {
    yield call(doDelete, `/cards/${cardId}`);
    yield put(handleDeleteCardSuccess(cardId));
  } catch (error) {
    yield put(handleDeleteCardError(cardId, getErrorMessage(error)));
  }
}

function* toggleUpvote({ upvotes }) {
  const cardId = yield call(getActiveCardId);
  const userId = yield call(getUserId);

  const oldUpvotes = toggleUpvotes(upvotes, userId);
  try {
    const card = yield call(doPut, `/cards/${cardId}`, { upvotes });
    yield put(handleToggleUpvoteSuccess(card));
  } catch (error) {
    yield put(handleToggleUpvoteError(cardId, getErrorMessage(error), oldUpvotes));
  }
}

function* markUpToDate() {
  const cardId = yield call(getActiveCardId);
  try {
    const updatedCard = yield call(doPost, `/cards/${cardId}/markUpToDate`);
    yield put(handleMarkUpToDateSuccess(updatedCard));
  } catch (error) {
    yield put(handleMarkUpToDateError(cardId, getErrorMessage(error)));
  }
}

function* markOutOfDate() {
  const cardId = yield call(getActiveCardId);
  const reason = yield select((state) => state.cards.activeCard.outOfDateReasonInput);

  try {
    const updatedCard = yield call(doPost, `/cards/${cardId}/markOutOfDate`, { reason });
    yield put(handleMarkOutOfDateSuccess(updatedCard));
  } catch (error) {
    yield put(handleMarkOutOfDateError(cardId, getErrorMessage(error)));
  }
}

function* approveCard() {
  const cardId = yield call(getActiveCardId);

  try {
    const { updatedCard } = yield call(doPost, `/cards/${cardId}/approve`);
    yield put(handleApproveCardSuccess(updatedCard));
  } catch (error) {
    yield put(handleApproveCardError(cardId, getErrorMessage(error)));
  }
}

function* addBookmark({ cardId }) {
  const activeCard = yield call(getActiveCard);
  try {
    yield call(doPost, `/cards/${cardId}/bookmark`);
    yield put(handleAddBookmarkSuccess(cardId, activeCard));
  } catch (error) {
    yield put(handleAddBookmarkError(cardId, getErrorMessage(error)));
  }
}

function* removeBookmark({ cardId }) {
  try {
    yield call(doPost, `/cards/${cardId}/bookmark/remove`);
    yield put(handleRemoveBookmarkSuccess(cardId));
  } catch (error) {
    yield put(handleRemoveBookmarkError(cardId, getErrorMessage(error)));
  }
}

function* addAttachment({ cardId, key, file }) {
  if (!cardId) {
    // eslint-disable-next-line no-param-reassign
    cardId = yield call(getActiveCardId);
  }

  try {
    const formData = new FormData();
    formData.append('file', file);

    const attachment = yield call(doPost, '/files/upload', formData, { isForm: true });
    yield put(handleAddCardAttachmentSuccess(cardId, key, attachment));
  } catch (error) {
    yield put(handleAddCardAttachmentError(cardId, key, getErrorMessage(error)));
  }
}

function* getSlackThread() {
  const activeCard = yield call(getActiveCard);
  const { slackThreadConvoPairs, slackThreadIndex } = activeCard;
  const { threadId, channelId } = slackThreadConvoPairs[slackThreadIndex];

  try {
    const { slackReplies } = yield call(doPost, '/slack/getThreadReplies', { threadId, channelId });
    yield put(handleGetSlackThreadSuccess(activeCard._id, slackReplies));
  } catch (error) {
    yield put(handleGetSlackThreadError(activeCard._id, getErrorMessage(error)));
  }
}
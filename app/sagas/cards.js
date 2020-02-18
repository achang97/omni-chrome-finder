import { delay } from 'redux-saga';
import { take, call, fork, all, cancel, cancelled, put, select } from 'redux-saga/effects';
import { doGet, doPost, doPut, doDelete } from '../utils/request'
import { getArrayIds, getArrayField } from '../utils/arrayHelpers';
import { getContentStateFromEditorState } from '../utils/editorHelpers';
import { CARD_STATUS_OPTIONS, PERMISSION_OPTIONS_MAP, AUTO_REMIND_VALUE } from '../utils/constants';
import { CREATE_CARD_REQUEST, UPDATE_CARD_REQUEST, DELETE_CARD_REQUEST } from '../actions/actionTypes';
import { 
  handleCreateCardSuccess, handleCreateCardError,
  handleUpdateCardSuccess, handleUpdateCardError,
  handleDeleteCardSuccess, handleDeleteCardError,
} from '../actions/cards';

export default function* watchCardsRequests() {
  let action;

  while (action = yield take([CREATE_CARD_REQUEST, UPDATE_CARD_REQUEST, DELETE_CARD_REQUEST])) {
    const { type, payload } = action;
    switch (type) {
      case CREATE_CARD_REQUEST: {
        yield fork(createCard)
        break;
      }
      case UPDATE_CARD_REQUEST: {
        yield fork(updateCard)
        break;
      }
      case DELETE_CARD_REQUEST: {
        yield fork(deleteCard)
        break;
      }
    }
  }
}

function* convertCardToBackendFormat() {
    const { question, answerEditorState, descriptionEditorState, owners, tags, keywords, verificationInterval, permissions, permissionGroups /*, attachments, messages */ } = yield select(state => state.cards.activeCard.edits);
    const { _id } = yield select(state => state.auth.user._id);

    const { contentState: descriptionContentState, text: descriptionText } = getContentStateFromEditorState(descriptionEditorState);
    const { contentState: answerContentState, text: answerText } = getContentStateFromEditorState(answerEditorState);

    const verificationInfo = { autoupdate: verificationInterval.value === AUTO_REMIND_VALUE };
    if (!verificationInfo.autoupdate) {
      verificationInfo.update_interval = verificationInterval;
    }

    const permissionsInfo = {
      user_permissions: permissions.value === PERMISSION_OPTIONS_MAP.JUST_ME ? [{ _id }] : [],
      permission_groups: permissions.value === PERMISSION_OPTIONS_MAP.SPECIFIC_GROUPS ? permissionGroups : [],
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
      status: CARD_STATUS_OPTIONS.UP_TO_DATE,
    }
}

function* createCard() {
  try {
    const newCardInfo = yield call(convertCardToBackendFormat);
    const card = yield call(doPost, '/cards', newCardInfo);
    yield put(handleCreateCardSuccess(card));
  } catch(error) {
    const { response: { data } } = error;
    yield put(handleCreateCardError(data.error));
  }
}

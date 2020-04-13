import { take, call, fork, put } from 'redux-saga/effects';
import { doPost, doDelete, getErrorMessage } from 'utils/request';
import { convertAttachmentsToBackendFormat, isUploadedFile } from 'utils/file';
import { ADD_CREATE_ATTACHMENT_REQUEST, REMOVE_CREATE_ATTACHMENT_REQUEST } from 'actions/actionTypes';
import {
  handleAddCreateAttachmentSuccess, handleAddCreateAttachmentError,
  handleRemoveCreateAttachmentSuccess, handleRemoveCreateAttachmentError,
} from 'actions/create';

export default function* watchCreateRequests() {
  let action;

  while (action = yield take([
    ADD_CREATE_ATTACHMENT_REQUEST, REMOVE_CREATE_ATTACHMENT_REQUEST
  ])) {
    const { type, payload } = action;
    switch (type) {
      case ADD_CREATE_ATTACHMENT_REQUEST: {
        yield fork(addAttachment, payload);
        break;
      }
      case REMOVE_CREATE_ATTACHMENT_REQUEST: {
        yield fork(removeAttachment, payload);
        break;
      }
      default: {
        break;
      }
    }
  }
}

function* addAttachment({ key, file }) {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const attachment = yield call(doPost, '/files/upload', formData, { isForm: true });
    yield put(handleAddCreateAttachmentSuccess(key, attachment));
  } catch (error) {
    console.log(error)
    yield put(handleAddCreateAttachmentError(key, getErrorMessage(error)));
  }
}

function* removeAttachment({ key }) {
  try {
    if (isUploadedFile(key)) {
      yield call(doDelete, `/files/${key}`);
    }
    yield put(handleRemoveCreateAttachmentSuccess(key));
  } catch (error) {
    yield put(handleRemoveCreateAttachmentError(key, getErrorMessage(error)));
  }
}
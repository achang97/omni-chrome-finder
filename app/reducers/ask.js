import * as types from '../actions/actionTypes';
import _ from 'underscore';

import { ASK_INTEGRATIONS } from '../utils/constants';
import { removeIndex, updateIndex } from '../utils/arrayHelpers';
import { EditorState } from 'draft-js';

const initialState = {
  /* Minified Page */
  searchText: '',

  /* Expanded Page */
  activeIntegration: ASK_INTEGRATIONS[0],
  questionTitle: '',
  questionDescription: EditorState.createEmpty(),
  recipients: [],

  // Screen Recording
  desktopSharing: false,
  localStream: null,
  mediaRecorder: null,
  recordedChunks: [],
  screenRecordingError: null,

  attachments: [],
  slackConversations: [],
};

export default function display(state = initialState, action) {
  const { type, payload = {} } = action;

  const updateAttachmentByKey = (key, newInfo) => {
    return {
      ...state,
      attachments: state.attachments.map(currAttachment => currAttachment.key === key ? { ...currAttachment, ...newInfo } : currAttachment)
    }
  }

  switch (type) {
    case types.UPDATE_ASK_SEARCH_TEXT: {
      const { text } = payload;
      return { ...state, searchText: text };
    }

    case types.CHANGE_ASK_INTEGRATION: {
      const { integration } = payload;
      return { ...state, activeIntegration: integration };
    }

    case types.UPDATE_ASK_QUESTION_TITLE: {
      const { text } = payload;
      return { ...state, questionTitle: text };
    }
    case types.UPDATE_ASK_QUESTION_DESCRIPTION: {
      const { description } = payload;
      return { ...state, questionDescription: description };
    }

    case types.ADD_ASK_RECIPIENT: {
      const { recipient } = payload;
      const { recipients } = state;

      if (recipients.some(({ id }) => id === recipient.id)) return state;

      let newRecipients;
      if (recipient.type === 'user') {
        newRecipients = [...recipients, recipient];
      } else { //
        newRecipients = [...recipients, { ...recipient, mentions: [], isDropdownOpen: false, isDropdownSelectOpen: false }];
      }      

      return { ...state, recipients: newRecipients }; 
    }
    case types.REMOVE_ASK_RECIPIENT: {
      const { index } = payload;
      return { ...state, recipients: removeIndex(state.recipients, index) }
    }
    case types.UPDATE_ASK_RECIPIENT: {
      const { index, newInfo } = payload;
      const { recipients } = state;
      return { ...state, recipients: updateIndex(recipients, index, newInfo, true) }
    }

    case types.START_ASK_SCREEN_RECORDING: {
      const { stream, mediaRecorder } = payload;
      return { ...state, desktopSharing: true, localStream: stream, mediaRecorder, screenRecordingError: null };
    }
    case types.ADD_ASK_SCREEN_RECORDING_CHUNK: {
      const { recordingChunk } = payload;
      return { ...state, recordedChunks: [...state.recordedChunks, recordingChunk] }
    }
    case types.END_ASK_SCREEN_RECORDING: {
      return { ...state, desktopSharing: false, localStream: null, mediaRecorder: null, recordedChunks: [], screenRecordingError: null };
    }
    case types.ASK_SCREEN_RECORDING_ERROR: {
      const { error } = payload;
      return { ...state, desktopSharing: false, localStream: null, mediaRecorder: null, recordedChunks: [], screenRecordingError: error }
    }

    case types.ADD_ASK_ATTACHMENT_REQUEST: {
      const { key, file } = payload;
      return { ...state, attachments: [...state.attachments, { key, name: file.name, isLoading: true, error: null }] };
    }
    case types.ADD_ASK_ATTACHMENT_SUCCESS: {
      const { key, attachment } = payload;
      return updateAttachmentByKey(key, { isLoading: false, ...attachment });
    }
    case types.ADD_ASK_ATTACHMENT_ERROR: {
      const { key, error } = payload;
      return updateAttachmentByKey(key, { isLoading: false, error: 'Upload failed. This file will not be attached.' });
    }

    case types.REMOVE_ASK_ATTACHMENT_REQUEST: {
      const { key } = payload;
      return updateAttachmentByKey(key, { isLoading: true });
    }
    case types.REMOVE_ASK_ATTACHMENT_SUCCESS: {
      const { key } = payload;
      return { ...state, attachments: state.attachments.filter(attachment => attachment.key !== key) };
    }
    case types.REMOVE_ASK_ATTACHMENT_ERROR: {
      const { key, error } = payload;
      return updateAttachmentByKey(key, { isLoading: false, error: 'Failed to remove file. Please try again.' });
    }

    case types.UPDATE_ASK_ATTACHMENT_NAME: {
      const { key, name } = payload;
      return updateAttachmentByKey(key, { name });
    }

    case types.GET_SLACK_CONVERSATIONS_REQUEST: {
      return { ...state, isGettingSlackConversations: true, getSlackConversationsError: null }
    }
    case types.GET_SLACK_CONVERSATIONS_SUCCESS: {
      const { conversations } = payload;
      return { ...state, isGettingSlackConversations: false, slackConversations: conversations }
    }
    case types.GET_SLACK_CONVERSATIONS_ERROR: {
      const { error } = payload;
      return { ...state, isGettingSlackConversations: false, getSlackConversationsError: error }
    }

    case types.ASK_QUESTION_REQUEST: {
      return { ...state, isAskingQuestion: true, askError: null, askSuccess: null };
    }
    case types.ASK_QUESTION_SUCCESS: {
      return { ...initialState, isAskingQuestion: false, askSuccess: true };
    }
    case types.ASK_QUESTION_ERROR: {
      const { error } = payload;
      return { ...state, isAskingQuestion: false, askSuccess: false, askError: error };
    }
    case types.CLEAR_ASK_QUESTION_INFO: {
      return { ...state, askError: null, askSuccess: null }      
    }

    default:
      return state;
  }
}
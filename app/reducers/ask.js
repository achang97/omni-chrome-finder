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
};

export default function display(state = initialState, action) {
  const { type, payload = {} } = action;

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
      return { ...state, recipients: updateIndex(recipients, index, { ...recipients[index], ...newInfo }) }
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
      const { screenRecording } = payload;
      return { ...state, desktopSharing: false, localStream: null, mediaRecorder: null, recordedChunks: [], screenRecordingError: null, attachments: [...state.attachments, { type: 'recording', data: screenRecording }] };
    }
    case types.ASK_SCREEN_RECORDING_ERROR: {
      const { error } = payload;
      return { ...state, desktopSharing: false, localStream: null, mediaRecorder: null, recordedChunks: [], screenRecordingError: error }
    }

    case types.ADD_ASK_ATTACHMENTS: {
      const { attachments } = payload;
      const newAttachments = attachments.map(attachment => ({ type: 'attachment', data: attachment }))
      return { ...state, attachments: [...state.attachments, ...newAttachments] }
    }
    case types.REMOVE_ASK_ATTACHMENT: {
      const { index } = payload;
      return { ...state, attachments: removeIndex(state.attachments, index) }
    }

    default:
      return state;
  }
}
import * as types from 'actions/actionTypes';
import { ASK } from 'appConstants';
import { removeIndex, updateIndex, updateArrayOfObjects } from 'utils/array';

const initialState = {
  /* Minified Page */
  searchText: '',
  showPerformanceScore: false,
  recentCards: [],

  /* Expanded Page */
  activeIntegration: ASK.INTEGRATIONS[0],
  questionTitle: '',
  recipients: [],

  attachments: [],
  slackConversations: []
};

export default function askReducer(state = initialState, action) {
  const { type, payload = {} } = action;

  const updateAttachmentByKey = (key, newInfo) => ({
    ...state,
    attachments: updateArrayOfObjects(state.attachments, { key }, newInfo)
  });

  switch (type) {
    case types.UPDATE_ASK_SEARCH_TEXT: {
      const { text } = payload;
      return { ...state, searchText: text };
    }
    case types.TOGGLE_PERFORMANCE_SCORE: {
      const { showPerformanceScore } = state;
      return {
        ...state,
        showPerformanceScore: !showPerformanceScore
      };
    }

    case types.CHANGE_ASK_INTEGRATION: {
      const { integration } = payload;
      return { ...state, activeIntegration: integration };
    }

    case types.UPDATE_ASK_QUESTION_TITLE: {
      const { text } = payload;
      return { ...state, questionTitle: text.replace('\n', '') };
    }

    case types.ADD_ASK_RECIPIENT: {
      const { recipient } = payload;
      const { recipients } = state;

      if (recipients.some(({ id }) => id === recipient.id)) return state;

      let newRecipients;
      if (recipient.type === 'user') {
        newRecipients = [...recipients, recipient];
      } else {
        //
        const newRecipient = {
          ...recipient,
          mentions: [],
          isDropdownOpen: false,
          isDropdownSelectOpen: false
        };
        newRecipients = [...recipients, newRecipient];
      }

      return { ...state, recipients: newRecipients };
    }
    case types.REMOVE_ASK_RECIPIENT: {
      const { index } = payload;
      return { ...state, recipients: removeIndex(state.recipients, index) };
    }
    case types.UPDATE_ASK_RECIPIENT: {
      const { index, newInfo } = payload;
      const { recipients } = state;
      return { ...state, recipients: updateIndex(recipients, index, newInfo, true) };
    }

    case types.ADD_ASK_ATTACHMENT_REQUEST: {
      const { key, file } = payload;
      return {
        ...state,
        attachments: [
          ...state.attachments,
          { key, name: file.name, mimetype: file.type, isLoading: true, error: null }
        ]
      };
    }
    case types.ADD_ASK_ATTACHMENT_SUCCESS: {
      const { key, attachment } = payload;
      return updateAttachmentByKey(key, { isLoading: false, ...attachment });
    }
    case types.ADD_ASK_ATTACHMENT_ERROR: {
      const { key } = payload;
      return updateAttachmentByKey(key, {
        isLoading: false,
        error: 'Upload failed. This file will not be attached.'
      });
    }

    case types.REMOVE_ASK_ATTACHMENT_REQUEST: {
      const { key } = payload;
      return updateAttachmentByKey(key, { isLoading: true });
    }
    case types.REMOVE_ASK_ATTACHMENT_SUCCESS: {
      const { key } = payload;
      return {
        ...state,
        attachments: state.attachments.filter((attachment) => attachment.key !== key)
      };
    }
    case types.REMOVE_ASK_ATTACHMENT_ERROR: {
      const { key } = payload;
      return updateAttachmentByKey(key, {
        isLoading: false,
        error: 'Failed to remove file. Please try again.'
      });
    }

    case types.UPDATE_ASK_ATTACHMENT_NAME: {
      const { key, name } = payload;
      return updateAttachmentByKey(key, { name });
    }

    case types.GET_SLACK_CONVERSATIONS_REQUEST: {
      return { ...state, isGettingSlackConversations: true, getSlackConversationsError: null };
    }
    case types.GET_SLACK_CONVERSATIONS_SUCCESS: {
      const { conversations } = payload;
      return { ...state, isGettingSlackConversations: false, slackConversations: conversations };
    }
    case types.GET_SLACK_CONVERSATIONS_ERROR: {
      const { error } = payload;
      return { ...state, isGettingSlackConversations: false, getSlackConversationsError: error };
    }

    case types.GET_RECENT_CARDS_REQUEST: {
      return { ...state, isGettingRecentCards: true, getRecentError: null };
    }
    case types.GET_RECENT_CARDS_SUCCESS: {
      const { cards } = payload;
      return { ...state, isGettingRecentCards: false, recentCards: cards };
    }
    case types.GET_RECENT_CARDS_ERROR: {
      const { error } = payload;
      return { ...state, isGettingRecentCards: false, getRecentError: error };
    }

    case types.ASK_QUESTION_REQUEST: {
      return { ...state, isAskingQuestion: true, askError: null, askSuccess: null };
    }
    case types.ASK_QUESTION_SUCCESS: {
      const { slackConversations } = state;
      return { ...initialState, isAskingQuestion: false, askSuccess: true, slackConversations };
    }
    case types.ASK_QUESTION_ERROR: {
      const { error } = payload;
      return { ...state, isAskingQuestion: false, askSuccess: false, askError: error };
    }
    case types.CLEAR_ASK_QUESTION_INFO: {
      return { ...state, askError: null, askSuccess: null };
    }

    default:
      return state;
  }
}

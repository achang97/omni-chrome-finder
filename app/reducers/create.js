import { EditorState } from 'draft-js';
import { updateArrayOfObjects } from 'utils/array';
import * as types from 'actions/actionTypes';

const initialState = {
  isTemplateView: false,
  templates: {},
  selectedTemplateCategory: null,

  question: '',
  answerEditorState: EditorState.createEmpty(),
  attachments: []
};

export default function createReducer(state = initialState, action) {
  const { type, payload = {} } = action;

  const updateAttachmentByKey = (key, newInfo) => ({
    ...state,
    attachments: updateArrayOfObjects(state.attachments, { key }, newInfo)
  });

  switch (type) {
    case types.UPDATE_CREATE_QUESTION: {
      const { newValue } = payload;
      return { ...state, question: newValue };
    }
    case types.UPDATE_CREATE_ANSWER_EDITOR: {
      const { editorState } = payload;
      return { ...state, answerEditorState: editorState };
    }
    case types.UPDATE_CREATE_FINDER_NODE: {
      const { finderNode } = payload;
      return { ...state, finderNode };
    }
    case types.CLEAR_CREATE_PANEL: {
      return initialState;
    }

    case types.TOGGLE_TEMPLATE_VIEW: {
      return { ...state, isTemplateView: !state.isTemplateView };
    }
    case types.UPDATE_SELECTED_TEMPLATE_CATEGORY: {
      const { category } = payload;
      return { ...state, selectedTemplateCategory: category };
    }

    case types.GET_TEMPLATES_REQUEST: {
      return { ...state, isGettingTemplates: true, templatesError: null };
    }
    case types.GET_TEMPLATES_SUCCESS: {
      const { templates } = payload;
      return { ...state, isGettingTemplates: false, templates };
    }
    case types.GET_TEMPLATES_ERROR: {
      const { error } = payload;
      return { ...state, isGettingTemplates: false, templatesError: error };
    }

    case types.ADD_CREATE_ATTACHMENT_REQUEST: {
      const { key, file } = payload;
      return {
        ...state,
        attachments: [
          ...state.attachments,
          { key, name: file.name, mimetype: file.type, isLoading: true, error: null }
        ]
      };
    }
    case types.ADD_CREATE_ATTACHMENT_SUCCESS: {
      const { key, attachment } = payload;
      return updateAttachmentByKey(key, { isLoading: false, ...attachment });
    }
    case types.ADD_CREATE_ATTACHMENT_ERROR: {
      const { key } = payload;
      return updateAttachmentByKey(key, {
        isLoading: false,
        error: 'Upload failed. This file will not be attached.'
      });
    }

    case types.REMOVE_CREATE_ATTACHMENT_REQUEST: {
      const { key } = payload;
      return updateAttachmentByKey(key, { isLoading: true });
    }
    case types.REMOVE_CREATE_ATTACHMENT_SUCCESS: {
      const { key } = payload;
      return {
        ...state,
        attachments: state.attachments.filter((attachment) => attachment.key !== key)
      };
    }
    case types.REMOVE_CREATE_ATTACHMENT_ERROR: {
      const { key } = payload;
      return updateAttachmentByKey(key, {
        isLoading: false,
        error: 'Failed to remove file. Please try again.'
      });
    }

    case types.UPDATE_CREATE_ATTACHMENT_NAME: {
      const { key, name } = payload;
      return updateAttachmentByKey(key, { name });
    }

    default:
      return state;
  }
}

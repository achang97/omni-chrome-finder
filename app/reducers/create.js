import * as types from '../actions/actionTypes';
import _ from 'underscore';
import { EditorState } from 'draft-js';

const initialState = {
  isDescriptionEditorShown: false,
  question: '',
  descriptionEditorState: EditorState.createEmpty(),
  answerEditorState: EditorState.createEmpty(),
};

export default function create(state = initialState, action) {
  const { type, payload = {} } = action;

  switch (type) {
    case types.SHOW_CREATE_DESCRIPTION_EDITOR: {
      return { ...state, isDescriptionEditorShown: true };
    }
    case types.UPDATE_CREATE_QUESTION: {
      const { newValue } = payload;
      return { ...state, question: newValue };
    }
    case types.UPDATE_CREATE_ANSWER_EDITOR: {
      const { editorState } = payload;
      return { ...state, answerEditorState: editorState };
    }
    case types.UPDATE_CREATE_DESCRIPTION_EDITOR: {
      const { editorState } = payload;
      return { ...state, descriptionEditorState: editorState };
    }
    case types.CLEAR_CREATE_PANEL: {
      return { ...state, question: '', answerEditorState: EditorState.createEmpty(), descriptionEditorState: EditorState.createEmpty() };
    }

    default:
      return state;
  }
}

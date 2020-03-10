import { convertToRaw, convertFromRaw, EditorState } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';

export const getContentStateFromEditorState = (editorState) => {
  const contentState = editorState.getCurrentContent();
  return {
    text: contentState.getPlainText(),
    contentState: JSON.stringify(convertToRaw(contentState)),
  };
};

export const getContentStateFromString = contentStateString => (
  convertFromRaw(JSON.parse(contentStateString))
);

export const getContentStateHTMLFromString = contentStateString => (
  stateToHTML(getContentStateFromString(contentStateString))
);

export const getEditorStateFromContentState = contentStateString => (
  EditorState.createWithContent(getContentStateFromString(contentStateString))
);

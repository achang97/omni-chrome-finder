import { convertToRaw, convertFromRaw, EditorState } from 'draft-js';
import {stateToHTML} from 'draft-js-export-html';

export const getContentStateFromEditorState = (editorState) => {
	const contentState = editorState.getCurrentContent();
	return {
		text: contentState.getPlainText(),
		contentState: JSON.stringify(convertToRaw(contentState)),
	}
}

export const getContentStateHTMLFromString = (contentStateString) => {
	return stateToHTML(convertFromRaw(JSON.parse(contentStateString)));
}

export const getEditorStateFromContentState = (contentStateString) => {
	return EditorState.createWithContent(getContentStateFromString(contentStateString));
}
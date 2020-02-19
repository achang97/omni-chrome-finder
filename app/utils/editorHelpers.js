import { convertToRaw, convertFromRaw, EditorState } from 'draft-js';
import {stateToHTML} from 'draft-js-export-html';

export const getContentStateFromEditorState = (editorState) => {
	const contentState = editorState.getCurrentContent();
	return {
		text: contentState.getPlainText(),
		contentState: JSON.stringify(convertToRaw(contentState)),
	}
}

export const getContentStateFromString = (contentStateString) => {
	return convertFromRaw(JSON.parse(contentStateString));
}

export const getContentStateHTMLFromString = (contentStateString) => {
	return stateToHTML(getContentStateFromString(contentStateString));
}

export const getEditorStateFromContentState = (contentStateString) => {
	return EditorState.createWithContent(getContentStateFromString(contentStateString));
}
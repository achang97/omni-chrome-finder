import { convertToRaw, convertFromRaw, EditorState } from 'draft-js';

export const getContentStateFromEditorState = (editorState) => {
	const contentState = editorState.getCurrentContent();
	return {
		text: contentState.getPlainText(),
		contentState: JSON.stringify(convertToRaw(contentState)),
	}
}

export const getEditorStateFromContentState = (contentStateString) => {
	const contentState = convertFromRaw(JSON.parse(contentStateString));
	return EditorState.createWithContent(contentState);
}
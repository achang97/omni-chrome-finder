import React, { Component } from 'react';
import { EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import PropTypes from 'prop-types';
import { CARD_TOOLBAR_PROPS, EXTENSION_TOOLBAR_PROPS } from './TextEditorProps.js';

import style from './text-editor.css';
import { getStyleApplicationFn } from '../../../utils/styleHelpers';
import { EDITOR_TYPE } from '../../../utils/constants';
const s = getStyleApplicationFn(style);

export default class TextEditor extends Component {
	constructor(props) {
    	super(props);
    	this.state = {}
      this.setDomEditorRef = editorRef => this.domEditor = editorRef;
  }

  componentDidMount() {
    if (this.props.autoFocus && this.domEditor !== null) {
      this.domEditor.focus();
    }
  }

	render() {
    let { editorState, wrapperClassName, editorClassName, toolbarClassName, onEditorStateChange, toolbarHidden, readOnly, editorType, editorRole } = this.props;
		
    if (editorClassName === '') {
      editorClassName = editorType === 'CARD' ? 'text-editor' : 'text-editor-extension';
    }
    
    return (
				<Editor
          editorRef={this.setDomEditorRef}
	        editorState={editorState}
	        wrapperClassName={s(wrapperClassName)}
	        editorClassName={s(editorClassName )}
	        toolbarClassName={s(toolbarClassName)}
	        onEditorStateChange={onEditorStateChange}
	        toolbar={editorType === 'CARD' ? CARD_TOOLBAR_PROPS : EXTENSION_TOOLBAR_PROPS}
          toolbarHidden={toolbarHidden}
          readOnly={readOnly}
          placeholder={editorRole === EDITOR_TYPE.DESCRIPTION ? "Add a description here" : "Add an answer here"}
	      />
		)
	}
}

TextEditor.propTypes = {
  editorState: PropTypes.instanceOf(EditorState),
  wrapperClassName: PropTypes.string,
  editorClassName: PropTypes.string,
  toolbarClassName: PropTypes.string,
  onEditorStateChange: PropTypes.func,
  toolbarHidden: PropTypes.bool,
  readOnly: PropTypes.bool,
  autoFocus: PropTypes.bool,
  editorType: PropTypes.oneOf(['CARD', 'EXTENSION']),
  editorRole: PropTypes.oneOf([EDITOR_TYPE])
}


TextEditor.defaultProps = {
  wrapperClassName: '',
  editorClassName: '',
  toolbarClassName: 'text-editor-toolbar',
  toolbarHidden: false,
  readOnly: false,
  autoFocus: false,
  editorType: 'CARD',
  editorRole: EDITOR_TYPE.DESCRIPTION,
}
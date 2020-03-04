import React, { Component } from 'react';
import { EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import PropTypes from 'prop-types';
import { CARD_TOOLBAR_PROPS, EXTENSION_TOOLBAR_PROPS } from './TextEditorProps.js';
import { MdTextFormat, MdKeyboardArrowLeft } from "react-icons/md";
import { IoMdArrowDropleft, IoMdArrowDropright } from "react-icons/io";
import { CircleButton } from '../../common/CircleButton';

import style from './text-editor.css';
import { getStyleApplicationFn } from '../../../utils/styleHelpers';
import { EDITOR_TYPE } from '../../../utils/constants';
const s = getStyleApplicationFn(style);

export default class TextEditor extends Component {
	constructor(props) {
    	super(props);
    	this.state = {
        hideToolbar: true,
      }
      this.setDomEditorRef = editorRef => this.domEditor = editorRef;
  }

  componentDidMount() {
    const { autoFocus, toolbarHidden } = this.props;
    const { hideToolbar } = this.state;

    if (autoFocus && this.domEditor !== null) {
      this.domEditor.focus();
    }
    if (hideToolbar !== toolbarHidden) {
      this.setState( { hideToolbar: toolbarHidden } );
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { toolbarHidden } = this.props;

    if ( (prevState.hideToolbar !== toolbarHidden) && ( prevState.hideToolbar !== true ) ) {
      this.setState( { hideToolbar: toolbarHidden } );
    }
  }

  toggleToolbar = () => {
    const { hideToolbar } = this.state;

    this.setState( { hideToolbar: !hideToolbar } );
    this.domEditor.focus();
  }

	render() {
    let { editorState, className, wrapperClassName, editorClassName, toolbarClassName, onEditorStateChange, readOnly, editorType, editorRole, onClick } = this.props;
    const { hideToolbar } = this.state;

    if (editorClassName === '') {
      editorClassName = editorType === 'CARD' ? 'text-editor' : 'text-editor-extension';
    }
    
    return (
      <div 
        className={s(`relative flex flex-col min-h-0 ${editorType === 'CARD' ? 'flex-grow' : ''} ${className}`)}
        onClick={ () => { onClick && onClick() } } >
				<Editor
          editorRef={this.setDomEditorRef}
	        editorState={editorState}
	        wrapperClassName={s(wrapperClassName)}
	        editorClassName={s(`${editorClassName} ${hideToolbar ? 'rounded-lg' : ''}`)}
	        toolbarClassName={s(toolbarClassName)}
	        onEditorStateChange={onEditorStateChange}
	        toolbar={editorType === 'CARD' ? CARD_TOOLBAR_PROPS : EXTENSION_TOOLBAR_PROPS}
          toolbarHidden={hideToolbar}
          readOnly={readOnly}
          placeholder={editorRole === EDITOR_TYPE.DESCRIPTION ? "Add a description here" : "Add an answer here"}
	      />
        {
          !readOnly &&
          <div className={s('text-editor-toggle-rte-button absolute top-0 right-0 text-white mt-sm flex justify-center items-center text-lg shadow-md flex cursor-pointer')}
          onClick={ () => this.toggleToolbar() }>
            { hideToolbar ?
              <div>
                <IoMdArrowDropleft className={s('text-editor-toggle-arrow')}/>
                <MdTextFormat />
              </div> :
              <div>
                <IoMdArrowDropright className={s('text-editor-toggle-arrow')}/>
              </div>
            }
          </div>
        }
      </div>
		)
	}
}

TextEditor.propTypes = {
  editorState: PropTypes.instanceOf(EditorState),
  className: PropTypes.string,
  wrapperClassName: PropTypes.string,
  editorClassName: PropTypes.string,
  toolbarClassName: PropTypes.string,
  onEditorStateChange: PropTypes.func,
  toolbarHidden: PropTypes.bool,
  readOnly: PropTypes.bool,
  autoFocus: PropTypes.bool,
  editorType: PropTypes.oneOf(['CARD', 'EXTENSION']),
  editorRole: PropTypes.oneOf(['ANSWER', 'DESCRIPTION']),
  onClick: PropTypes.func,
}


TextEditor.defaultProps = {
  className: '',
  wrapperClassName: '',
  editorClassName: '',
  toolbarClassName: 'text-editor-toolbar',
  toolbarHidden: false,
  readOnly: false,
  autoFocus: false,
  editorType: 'CARD',
  editorRole: EDITOR_TYPE.DESCRIPTION,
}
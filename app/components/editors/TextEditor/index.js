import React, { Component } from 'react';
import { EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import PropTypes from 'prop-types';
import AnimateHeight from 'react-animate-height';
import { MdTextFormat, MdKeyboardArrowLeft, MdAdd } from 'react-icons/md';
import { IoMdArrowDropleft, IoMdArrowDropright } from 'react-icons/io';

import { Button } from 'components/common';
import { CARD_TOOLBAR_PROPS, EXTENSION_TOOLBAR_PROPS } from './TextEditorProps.js';

import style from './text-editor.css';
import { getStyleApplicationFn } from 'utils/style';
const s = getStyleApplicationFn(style);

export default class TextEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hideToolbar: props.toolbarHidden,
      expanded: props.expanded,
    };
    this.setDomEditorRef = editorRef => this.domEditor = editorRef;
  }

  componentDidMount() {
    const { autoFocus, toolbarHidden } = this.props;
    const { hideToolbar } = this.state;

    if (autoFocus && !!this.domEditor) {
      this.domEditor.focus();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { toolbarHidden, placeholder } = this.props;

    // Force rerender, as it doesn't rerender when placeholder changes
    if (prevProps.placeholder !== placeholder) {
      this.setState({});
    }

    if ((prevState.hideToolbar !== toolbarHidden) && !prevState.hideToolbar) {
      this.setState({ hideToolbar: toolbarHidden });
    }
  }

  toggleToolbar = () => {
    const { hideToolbar } = this.state;

    this.setState({ hideToolbar: !hideToolbar });
    this.domEditor.focus();
  }

  onExpandEditor = () => {
    const { onExpandEditor } = this.props;
    if (onExpandEditor) {
      onExpandEditor();
    } else {
      this.setState({ expanded: true });
    }
  }

  render() {
    let {
      editorState, className, wrapperClassName, editorClassName,
      toolbarClassName, onEditorStateChange, readOnly, editorType,
      minimizedPlaceholder, placeholder, onClick
    } = this.props;
    const { hideToolbar } = this.state;

    if (editorClassName === '') {
      editorClassName = editorType === 'CARD' ? 'text-editor' : 'text-editor-extension';
    }

    // Allow for either controlled or uncontrolled behavior
    const expanded = this.props.expanded || this.state.expanded;

    return (
      <>
        <div
          className={s(`text-editor-container ${editorType === 'CARD' ? 'flex-grow' : ''} ${className}`)}
          style={{ height: expanded ? 'auto' : 0, maxHeight: expanded ? '100vh' : 0 }}
          onClick={() => { onClick && onClick(); }}
        >
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
            placeholder={placeholder}
            handlePastedText={() => false}
          />
          {
            !readOnly &&
            <div
              className={s('text-editor-toggle-rte-button button-hover')}
              onClick={() => this.toggleToolbar()}
            >
              { hideToolbar ?
                <div className={s('flex')}>
                  <IoMdArrowDropleft className={s('text-editor-toggle-arrow')} />
                  <MdTextFormat />
                </div> :
                <div className={s('flex')}>
                  <IoMdArrowDropright className={s('text-editor-toggle-arrow')} />
                </div>
              }
            </div>
          }
        </div>
        <AnimateHeight height={!expanded ? 'auto' : 0}>
          <Button
            text={minimizedPlaceholder || placeholder}
            onClick={this.onExpandEditor}
            color={'secondary'}
            className={s('text-editor-minimized-button justify-start shadow-none')}
            icon={<MdAdd className={s('mr-reg')} />}
            underline={false}
          />
        </AnimateHeight>
      </>
    );
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
  onClick: PropTypes.func,
  placeholder: PropTypes.string,
  expanded: PropTypes.bool,
  onExpandEditor: PropTypes.func,
  minimizedPlaceholder: PropTypes.string,
};


TextEditor.defaultProps = {
  className: '',
  wrapperClassName: '',
  editorClassName: '',
  toolbarClassName: 'text-editor-toolbar',
  toolbarHidden: false,
  readOnly: false,
  autoFocus: false,
  editorType: 'CARD',
  expanded: true,
};

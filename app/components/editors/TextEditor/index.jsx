import React, { Component } from 'react';
import { EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import PropTypes from 'prop-types';
import AnimateHeight from 'react-animate-height';
import { MdTextFormat, MdAdd } from 'react-icons/md';
import { IoMdArrowDropleft, IoMdArrowDropright } from 'react-icons/io';

import { Button } from 'components/common';
import { getStyleApplicationFn } from 'utils/style';
import { CARD_TOOLBAR_PROPS, EXTENSION_TOOLBAR_PROPS } from './TextEditorProps';

import style from './text-editor.css';

const s = getStyleApplicationFn(style);

export default class TextEditor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hideToolbar: props.toolbarHidden,
      expanded: props.expanded
    };

    this.setDomEditorRef = (editorRef) => {
      this.domEditor = editorRef;
    };
  }

  componentDidMount() {
    const { autoFocus } = this.props;
    if (autoFocus && !!this.domEditor) {
      this.domEditor.focus();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { toolbarHidden, placeholder } = this.props;

    /* eslint-disable react/no-did-update-set-state */
    // Force rerender, as it doesn't rerender when placeholder changes
    if (prevProps.placeholder !== placeholder) {
      this.setState({});
    }

    if (prevState.hideToolbar !== toolbarHidden && !prevState.hideToolbar) {
      this.setState({ hideToolbar: toolbarHidden });
    }
    /* eslint-enable react/no-did-update-set-state */
  }

  toggleToolbar = () => {
    const { hideToolbar } = this.state;

    this.setState({ hideToolbar: !hideToolbar });
    this.domEditor.focus();
  };

  onExpandEditor = () => {
    const { onExpandEditor } = this.props;
    if (onExpandEditor) {
      onExpandEditor();
    } else {
      this.setState({ expanded: true });
    }
  };

  render() {
    const {
      editorState,
      className,
      wrapperClassName,
      editorClassName,
      toolbarClassName,
      onEditorStateChange,
      readOnly,
      editorType,
      minimizedPlaceholder,
      placeholder,
      onClick,
      expanded: propsExpanded
    } = this.props;
    const { hideToolbar, expanded: stateExpanded } = this.state;

    // Allow for either controlled or uncontrolled behavior
    const expanded = propsExpanded || stateExpanded;
    const defaultEditorClassName = editorType === 'CARD' ? 'text-editor' : 'text-editor-extension';

    return (
      <>
        <div
          className={s(
            `text-editor-container ${editorType === 'CARD' ? 'flex-grow' : ''} ${className}`
          )}
          style={{ height: expanded ? 'auto' : 0, maxHeight: expanded ? '100vh' : 0 }}
          onClick={() => onClick && onClick()}
        >
          <Editor
            editorRef={this.setDomEditorRef}
            editorState={editorState}
            wrapperClassName={s(wrapperClassName)}
            editorClassName={s(`
              ${defaultEditorClassName}
              ${editorClassName}
              ${hideToolbar ? 'rounded-lg' : ''}
            `)}
            toolbarClassName={s(`text-editor-toolbar ${toolbarClassName}`)}
            onEditorStateChange={onEditorStateChange}
            toolbar={editorType === 'CARD' ? CARD_TOOLBAR_PROPS : EXTENSION_TOOLBAR_PROPS}
            toolbarHidden={hideToolbar}
            readOnly={readOnly}
            placeholder={placeholder}
            handlePastedText={() => false}
          />
          {!readOnly && (
            <div
              className={s('text-editor-toggle-rte-button primary-gradient button-hover')}
              onClick={() => this.toggleToolbar()}
            >
              {hideToolbar ? (
                <div className={s('flex')}>
                  <IoMdArrowDropleft className={s('text-editor-toggle-arrow')} />
                  <MdTextFormat />
                </div>
              ) : (
                <div className={s('flex')}>
                  <IoMdArrowDropright className={s('text-editor-toggle-arrow')} />
                </div>
              )}
            </div>
          )}
        </div>
        <AnimateHeight height={!expanded ? 'auto' : 0}>
          <Button
            text={minimizedPlaceholder || placeholder}
            onClick={this.onExpandEditor}
            color="secondary"
            className={s('light-gradient justify-start shadow-none')}
            icon={<MdAdd className={s('mr-reg')} />}
            underline={false}
          />
        </AnimateHeight>
      </>
    );
  }
}

TextEditor.propTypes = {
  editorState: PropTypes.instanceOf(EditorState).isRequired,
  onEditorStateChange: PropTypes.func.isRequired,
  className: PropTypes.string,
  wrapperClassName: PropTypes.string,
  editorClassName: PropTypes.string,
  toolbarClassName: PropTypes.string,
  toolbarHidden: PropTypes.bool,
  readOnly: PropTypes.bool,
  autoFocus: PropTypes.bool,
  editorType: PropTypes.oneOf(['CARD', 'EXTENSION']),
  onClick: PropTypes.func,
  placeholder: PropTypes.string,
  minimizedPlaceholder: PropTypes.string,
  expanded: PropTypes.bool,
  onExpandEditor: PropTypes.func
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
  onExpandEditor: null,
  onClick: null,
  placeholder: null,
  minimizedPlaceholder: null
};

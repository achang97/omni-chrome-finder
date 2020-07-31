import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import queryString from 'query-string';

import Froala from 'froala-editor';
import FroalaEditor from 'react-froala-wysiwyg';
import FroalaEditorView from 'react-froala-wysiwyg/FroalaEditorView';

/* eslint-disable import/no-extraneous-dependencies, import/extensions */
// Import all Froala Editor plugins;
import 'froala-editor/js/plugins.pkgd.min.js';
import 'froala-editor/js/third_party/embedly.min.js';
import 'codemirror/mode/xml/xml.js';
/* eslint-enable import/no-extraneous-dependencies, import/extensions */

import { getStyleApplicationFn } from 'utils/style';
import { getVideoEmbeddedCode } from 'utils/editor';
import { getCardUrlParams } from 'utils/card';
import { createConfig } from 'utils/request';
import { URL } from 'appConstants/request';
import { MAIN_CONTAINER_ID, APP_CLASSNAME } from 'appConstants';

import CONFIG from './TextEditorProps';
import style from './text-editor.css';

const s = getStyleApplicationFn(style);

const EVENT_TYPE = {
  FILE: 'file',
  IMAGE: 'image',
  VIDEO: 'video'
};

class TextEditor extends React.Component {
  constructor(props) {
    super(props);
    this.editorRef = React.createRef();

    this.createCustomButtons();
  }

  createCustomButtons = () => {
    const { openCard } = this.props;

    const COMMANDS = [
      {
        type: 'openCustomLink',
        data: {
          title: 'Open Link',
          icon: 'linkOpen',
          // eslint-disable-next-line func-names, object-shorthand
          callback: function () {
            const link = this.link.get().getAttribute('href');
            const cardParams = getCardUrlParams(link);

            if (cardParams && cardParams.cardId) {
              openCard({ _id: cardParams.cardId });
            } else {
              window.open(link, '_blank');
            }
          }
        }
      }
    ];

    COMMANDS.forEach((command) => {
      Froala.RegisterCommand(command.type, command.data);
    });
  };

  handleUpload = (type, response) => {
    const { editor } = this.editorRef.current;
    const { token } = this.props;

    const attachment = JSON.parse(response);
    const { key, name } = attachment;

    const headers = createConfig(token);
    axios.get(`${URL.SERVER}/files/${key}/accesstoken`, headers).then(({ data }) => {
      const params = queryString.stringify({ token: data.token });
      const location = `${URL.SERVER}/files/bytoken/${key}?${params}`;

      switch (type) {
        case EVENT_TYPE.IMAGE: {
          editor.image.insert(location, null, null, editor.image.get());
          break;
        }
        case EVENT_TYPE.FILE: {
          editor.file.insert(location, name);
          break;
        }
        case EVENT_TYPE.VIDEO: {
          editor.video.insert(getVideoEmbeddedCode(location));
          break;
        }
        default:
          break;
      }
    });

    return false;
  };

  initializeEditor = () => {
    if (this.editorRef.current) {
      this.editorRef.current.editor.$html[0].id = MAIN_CONTAINER_ID;
      this.editorRef.current.editor.$html.addClass(APP_CLASSNAME);
      this.editorRef.current.editor.$html[0].addEventListener('click', () => {
        this.editorRef.current.editor.$el[0].focus();
      });
    }
  };

  render() {
    const {
      model,
      className,
      editorClassName,
      onModelChange,
      readOnly,
      autofocus,
      placeholder,
      token
    } = this.props;

    if (readOnly) {
      return (
        <div className={s(`text-editor-container overflow-auto ${className}`)}>
          <FroalaEditorView model={model} />
        </div>
      );
    }

    return (
      <div className={s(`text-editor-container ${className}`)}>
        <FroalaEditor
          ref={this.editorRef}
          config={{
            ...CONFIG,
            requestHeaders: createConfig(token).headers,
            events: {
              'image.uploaded': (response) => this.handleUpload(EVENT_TYPE.IMAGE, response),
              'file.uploaded': (response) => this.handleUpload(EVENT_TYPE.FILE, response),
              'video.uploaded': (response) => this.handleUpload(EVENT_TYPE.VIDEO, response),
              'edit.on': this.initializeEditor,
              initialized: this.initializeEditor
            },
            autofocus,
            placeholderText: placeholder,
            editorClass: s(`text-editor ${editorClassName}`)
          }}
          tag="textarea"
          model={model}
          onModelChange={onModelChange}
        />
      </div>
    );
  }
}

TextEditor.propTypes = {
  model: PropTypes.string,
  onModelChange: PropTypes.func,
  className: PropTypes.string,
  editorClassName: PropTypes.string,
  readOnly: PropTypes.bool,
  autofocus: PropTypes.bool,
  placeholder: PropTypes.string,

  // Redux State
  token: PropTypes.string.isRequired,

  // Redux Actions
  openCard: PropTypes.func.isRequired
};

TextEditor.defaultProps = {
  model: '',
  className: '',
  editorClassName: '',
  readOnly: false,
  autofocus: false,
  placeholder: null
};

export default TextEditor;

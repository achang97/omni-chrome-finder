import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import queryString from 'query-string';

import FroalaEditor from 'react-froala-wysiwyg';
import FroalaEditorView from 'react-froala-wysiwyg/FroalaEditorView';

/* eslint-disable import/no-extraneous-dependencies, import/extensions */
// Import all Froala Editor plugins;
import 'froala-editor/js/plugins.pkgd.min.js';
/* eslint-enable import/no-extraneous-dependencies, import/extensions */

import { getStyleApplicationFn } from 'utils/style';
import { getVideoEmbeddedCode } from 'utils/editor';
import { URL } from 'appConstants/request';

import { CARD_CONFIG, EXTENSION_CONFIG } from './TextEditorProps';
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
  }

  getRequestHeaders = () => {
    const { token } = this.props;
    return { Authorization: token };
  };

  handleUpload = (type, response) => {
    const { editor } = this.editorRef.current;

    const { key, name } = JSON.parse(response);
    const headers = { headers: this.getRequestHeaders() };
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

  render() {
    const {
      model,
      editorClassName,
      onModelChange,
      readOnly,
      autofocus,
      editorType,
      placeholder
    } = this.props;

    const defaultEditorClassName = editorType === 'CARD' ? 'text-editor' : 'text-editor-extension';

    if (readOnly) {
      return (
        <div className={s(`${defaultEditorClassName} ${editorClassName} overflow-auto`)}>
          <FroalaEditorView model={model} />
        </div>
      );
    }

    return (
      <FroalaEditor
        ref={this.editorRef}
        config={{
          ...(editorType === 'CARD' ? CARD_CONFIG : EXTENSION_CONFIG),
          requestHeaders: this.getRequestHeaders(),
          events: {
            'image.uploaded': (response) => this.handleUpload(EVENT_TYPE.IMAGE, response),
            'file.uploaded': (response) => this.handleUpload(EVENT_TYPE.FILE, response),
            'video.uploaded': (response) => this.handleUpload(EVENT_TYPE.VIDEO, response)
          },
          autofocus,
          placeholderText: placeholder,
          editorClass: s(`${defaultEditorClassName} ${editorClassName}`)
        }}
        tag="textarea"
        model={model}
        onModelChange={onModelChange}
      />
    );
  }
}

TextEditor.propTypes = {
  model: PropTypes.string,
  onModelChange: PropTypes.func,
  editorClassName: PropTypes.string,
  readOnly: PropTypes.bool,
  autofocus: PropTypes.bool,
  editorType: PropTypes.oneOf(['CARD', 'EXTENSION']),
  placeholder: PropTypes.string,

  // Redux State
  token: PropTypes.string.isRequired
};

TextEditor.defaultProps = {
  model: '',
  editorClassName: '',
  readOnly: false,
  autofocus: false,
  editorType: 'CARD',
  placeholder: null
};

export default TextEditor;

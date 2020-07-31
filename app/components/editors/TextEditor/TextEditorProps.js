import CodeMirror from 'codemirror/lib/codemirror';
import { URL } from 'appConstants/request';

const UPLOAD_URL = `${URL.SERVER}/files/upload`;

const CONFIG = {
  key: process.env.FROALA_KEY,
  charCounterCount: false,
  attribution: false,
  quickInsertEnabled: false,
  iframe: true,
  iframeDefaultStyle: `
    html { height: auto; min-height: 100vh; cursor: text !important; }
  `,
  iframeStyleFiles: [
    'https://cdn.jsdelivr.net/npm/froala-editor@3.0.6/css/froala_style.min.css',
    'https://cdn.jsdelivr.net/npm/froala-editor@3.0.6/css/froala_editor.pkgd.min.css',
    'https://cdn.jsdelivr.net/npm/froala-editor@3.0.6/css/plugins.pkgd.min.css',
    'https://cdn.jsdelivr.net/npm/froala-editor@3.0.6/css/froala_editor.min.css',
    'https://cdn.jsdelivr.net/npm/froala-editor@3.0.6/css/third_party/embedly.min.css',
    chrome.runtime.getURL('/style-overrides/froala.css'),
    chrome.runtime.getURL('/style-overrides/omni-app.css')
  ],

  // heightMin: '100vh',
  heightMax: '100vh',

  codeMirror: CodeMirror,
  codeBeautifierOptions: {
    end_with_newline: true,
    indent_inner_html: true,
    brace_style: 'expand',
    indent_char: '\t',
    indent_size: 1,
    wrap_line_length: 0
  },

  linkAlwaysBlank: true,
  linkAutoPrefix: 'https://',
  linkInsertButtons: ['linkBack'],
  linkEditButtons: ['openCustomLink', 'linkEdit', 'linkRemove'],

  paragraphFormatDefaultSelection: 'Normal',
  paragraphFormatSelection: true,

  fontFamilyDefaultSelection: 'Helvetica Neue Light',
  fontFamily: {
    'Arial,Helvetica,sans-serif': 'Arial',
    'HelveticaNeue-Light': 'Helvetica Neue Light',
    'Georgia,serif': 'Georgia',
    'Impact,Charcoal,sans-serif': 'Impact',
    'Tahoma,Geneva,sans-serif': 'Tahoma',
    "'Times New Roman',Times,serif": 'Times New Roman',
    'Verdana,Geneva,sans-serif': 'Verdana',
    'Courier New,sans-serif': 'Courier New'
  },

  // TODO: remove insertButtons once we have an endpoint to get list of existing images
  imageInsertButtons: ['imageBack', '|', 'imageUpload', 'imageByURL'],
  imageAddNewLine: true,
  imageDefaultAlign: 'left',
  imageStyles: {
    'fr-rounded': 'Rounded',
    'fr-bordered': 'Bordered'
  },

  videoDefaultAlign: 'left',

  embedlyEditButtons: ['embedlyRemove'],

  // Set the image upload URL.
  imageUploadURL: UPLOAD_URL,
  fileUploadURL: UPLOAD_URL,
  videoUploadURL: UPLOAD_URL,

  toolbarButtons: {
    alwaysShown: {
      buttons: ['paragraphFormat']
    },
    moreText: {
      buttons: [
        'fontFamily',
        'fontSize',
        'bold',
        'italic',
        'underline',
        'strikeThrough',
        'subscript',
        'superscript',
        'textColor',
        'backgroundColor',
        'inlineClass',
        'clearFormatting'
      ]
    },
    moreParagraph: {
      buttons: [
        'formatOL',
        'formatUL',
        'paragraphStyle',
        'lineHeight',
        'outdent',
        'indent',
        'quote'
      ],
      buttonsVisible: 2
    },
    align: {
      buttons: ['align']
    },
    moreRich: {
      buttons: [
        'insertLink',
        'insertImage',
        'embedly',
        'insertVideo',
        'insertTable',
        'emoticons',
        'specialCharacters',
        'insertFile',
        'insertHR'
      ],
      buttonsVisible: 2
    },
    moreMisc: {
      buttons: ['undo', 'redo', 'spellChecker', 'selectAll', 'html', 'help'],
      align: 'right',
      buttonsVisible: 2
    }
  }
};

export default CONFIG;

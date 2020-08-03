import CodeMirror from 'codemirror/lib/codemirror';
import { URL } from 'appConstants/request';

const UPLOAD_URL = `${URL.SERVER}/files/upload`;

const CONFIG = {
  key: process.env.FROALA_KEY,
  charCounterCount: false,
  attribution: false,
  quickInsertEnabled: false,
  iframe: true,

  // NOTE: this is pretty much ripped from the style overrides. It's obviously not pretty
  // but allows for the styles to appear more consistent to the end user. This could
  // need to be restructured later, if Froala allows for more instantenous setting of the id / classname.
  iframeDefaultStyle: `
    html {
      height: auto;
      cursor: text !important;
      font-size: 14px !important;
      line-height: 1.25 !important;
      cursor: default;

      /* prettier-ignore */
      font-family:
        "HelveticaNeue-Light",
        "Helvetica Neue Light",
        "Helvetica Neue",
        Helvetica,
        Arial,
        sans-serif !important;
      font-weight: 400;
      box-sizing: border-box;
      letter-spacing: 0;
    }

    body {
      padding: 10px;
      margin: 0px;
    }

    p, h1, h2, h3, h4, h5, h6 {
      line-height: 1.25;
    }

    h1, h2, h3, h4, h5, h6 {
      font-weight: bold !important;
      margin: 0.7em 0;

      /* prettier-ignore */
      font-family:
        'HelveticaNeue-Light',
        'Helvetica Neue Light',
        'Helvetica Neue',
        Helvetica,
        Arial,
        sans-serif !important;
    }

    h1 {
      font-size: 1.575em;
    }

    h2 {
      font-size: 1.425em;
    }

    h3 {
      font-size: 1.3em;
    }

    h4 {
      font-size: 1em;
    }

    h5 {
      font-size: 0.8em;
    }

    h6 {
      font-size: 0.7em;
    }

    p, pre, code {
      margin: 10px 0;
    }

    ol li, ul li {
      margin: 5px 0;
    }

    pre, code {
      font-family: 'Courier New', sans-serif;
      background: #211a1d0d;
      border-radius: 8px;
      padding: 5px;
    }

    ol, ul {
      padding-left: 35px;
    }

    ol {
      list-style-type: decimal;
    }

    ul {
      list-style-type: disc;
    }
  `,
  iframeStyleFiles: [
    'https://cdn.jsdelivr.net/npm/froala-editor@3.0.6/css/froala_style.min.css',
    'https://cdn.jsdelivr.net/npm/froala-editor@3.0.6/css/froala_editor.pkgd.min.css',
    'https://cdn.jsdelivr.net/npm/froala-editor@3.0.6/css/plugins.pkgd.min.css',
    'https://cdn.jsdelivr.net/npm/froala-editor@3.0.6/css/froala_editor.min.css',
    'https://cdn.jsdelivr.net/npm/froala-editor@3.0.6/css/third_party/embedly.min.css',
    chrome.runtime.getURL('/css/overrides.min.css')
  ],

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

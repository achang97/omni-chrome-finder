import { URL } from 'appConstants/request';

const UPLOAD_URL = `${URL.SERVER}/files/upload`;

export const BASE_CONFIG = {
  key: process.env.FROALA_KEY,
  charCounterCount: false,
  attribution: false,
  quickInsertEnabled: false,

  linkAlwaysBlank: true,
  linkAutoPrefix: 'https://',
  linkInsertButtons: ['linkBack'],
  linkEditButtons: ['linkOpen', 'linkEdit', 'linkRemove'],

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

  videoDefaultAlign: 'left',

  // Set the image upload URL.
  imageUploadURL: UPLOAD_URL,
  fileUploadURL: UPLOAD_URL,
  videoUploadURL: UPLOAD_URL
};

export const CARD_CONFIG = {
  ...BASE_CONFIG,
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
        'insertVideo',
        'insertTable',
        'emoticons',
        'specialCharacters',
        'embedly',
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

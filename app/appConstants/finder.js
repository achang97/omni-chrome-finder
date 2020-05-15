import { STATUS } from './card';

export const TAB_INDEX = -1;
export const TAB = null;
export const ROOT = 'root';

export const PATH_TYPE = {
  NODE: 'NODE',
  SEGMENT: 'SEGMENT'
};

export const SEGMENT_TYPE = {
  MY_CARDS: 'MY_CARDS',
  BOOKMARKED: 'BOOKMARKED'
};

// TODO: delete this once we get real data
export const MOCK_DIRECTORY_LOOKUP = {
  root: {
    _id: 'root',
    name: 'Home',
    children: ['product', 'company'],
    parent: null,
    card: null
  },
  product: {
    _id: 'product',
    name: 'Product But IT Is a Really Long Title Hahahahaa',
    children: [
      'product-card-1',
      'product-card-2',
      'product-card-3',
      'product-card-4',
      'product-card-5',
      'product-card-6',
      'product-card-7',
      'product-card-8',
      'product-card-9',
      'misc'
    ],
    parent: 'root',
    card: null
  },
  company: {
    _id: 'company',
    name: 'Company',
    children: ['company-card-1'],
    parent: 'root',
    card: null
  },
  misc: {
    _id: 'misc',
    name: 'Misc',
    children: [],
    parent: 'product',
    card: null
  },
  'product-card-1': {
    _id: 'product-card-1',
    name: '1',
    children: null,
    parent: 'product',
    card: {
      _id: 'asdofj3333',
      question: '1',
      status: STATUS.OUT_OF_DATE
    }
  },
  'product-card-2': {
    _id: 'product-card-2',
    name: '2',
    children: null,
    parent: 'product',
    card: {
      _id: 'asdo113333',
      question: '2',
      status: STATUS.UP_TO_DATE
    }
  },
  'product-card-3': {
    _id: 'product-card-3',
    name: '3',
    children: null,
    parent: 'product',
    card: {
      _id: 'asdo113333',
      question: '3',
      status: STATUS.UP_TO_DATE
    }
  },
  'product-card-4': {
    _id: 'product-card-4',
    name: '4',
    children: null,
    parent: 'product',
    card: {
      _id: 'asdo113333',
      question: '4?',
      status: STATUS.UP_TO_DATE
    }
  },
  'product-card-5': {
    _id: 'product-card-5',
    name: '5',
    children: null,
    parent: 'product',
    card: {
      _id: 'asdo113333',
      question: '5 How is Guru doing?',
      status: STATUS.UP_TO_DATE
    }
  },
  'product-card-6': {
    _id: 'product-card-6',
    name: '6 How is Guru doing?',
    children: null,
    parent: 'product',
    card: {
      _id: 'asdo113333',
      question: '6 How is Guru doing?',
      status: STATUS.NEEDS_VERIFICATION
    }
  },
  'product-card-7': {
    _id: 'product-card-7',
    name: '7 How is Guru doing?',
    children: null,
    parent: 'product',
    card: {
      _id: 'asdo113333',
      question: '7 How is Guru doing?',
      status: STATUS.NEEDS_APPROVAL
    }
  },
  'product-card-8': {
    _id: 'product-card-8',
    name: '8 How is Guru doing?',
    children: null,
    parent: 'product',
    card: {
      _id: 'asdo113333',
      question: '8 How is Guru doing?',
      status: STATUS.NOT_DOCUMENTED
    }
  },
  'product-card-9': {
    _id: 'product-card-9',
    name: '9 How is Guru doing?',
    children: null,
    parent: 'product',
    card: {
      _id: 'asdo113333',
      question: '9 How is Guru doing?',
      status: STATUS.NEEDS_VERIFICATION
    }
  },
  'company-card-1': {
    _id: 'company-card-1',
    name: 'How is Guru doing?',
    children: null,
    parent: 'product',
    card: {
      _id: 'asdo113333',
      question: 'How is Guru doing?',
      status: STATUS.UP_TO_DATE
    }
  }
};

Object.values(MOCK_DIRECTORY_LOOKUP).forEach((node) => {
  if (node.parent) {
    node.parent = MOCK_DIRECTORY_LOOKUP[node.parent];
  }

  if (node.children) {
    node.children = node.children.map((child) => MOCK_DIRECTORY_LOOKUP[child]);
  }
});

export default {
  TAB_INDEX,
  TAB,
  ROOT,
  PATH_TYPE,
  SEGMENT_TYPE,
  MOCK_DIRECTORY_LOOKUP
};

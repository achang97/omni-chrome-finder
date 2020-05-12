import _ from 'lodash';
import * as types from 'actions/actionTypes';

// TODO: delete this once we get real data
const MOCK_DIRECTORY_LOOKUP = {
  root: {
    id: 'root',
    name: 'Home',
    children: ['product', 'company'],
    parent: null,
    card: null
  },
  product: {
    id: 'product',
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
    id: 'company',
    name: 'Company',
    children: ['company-card-1'],
    parent: 'root',
    card: null
  },
  misc: {
    id: 'misc',
    name: 'Misc',
    children: [],
    parent: 'product',
    card: null
  },
  'product-card-1': {
    id: 'product-card-1',
    name: null,
    children: null,
    parent: 'product',
    card: {
      _id: 'asdofj3333',
      question: '1'
    }
  },
  'product-card-2': {
    id: 'product-card-2',
    name: null,
    children: null,
    parent: 'product',
    card: {
      _id: 'asdo113333',
      question: '2'
    }
  },
  'product-card-3': {
    id: 'product-card-3',
    name: null,
    children: null,
    parent: 'product',
    card: {
      _id: 'asdo113333',
      question: '3'
    }
  },
  'product-card-4': {
    id: 'product-card-4',
    name: null,
    children: null,
    parent: 'product',
    card: {
      _id: 'asdo113333',
      question: '4?'
    }
  },
  'product-card-5': {
    id: 'product-card-5',
    name: null,
    children: null,
    parent: 'product',
    card: {
      _id: 'asdo113333',
      question: '5 How is Guru doing?'
    }
  },
  'product-card-6': {
    id: 'product-card-6',
    name: null,
    children: null,
    parent: 'product',
    card: {
      _id: 'asdo113333',
      question: '6 How is Guru doing?'
    }
  },
  'product-card-7': {
    id: 'product-card-7',
    name: null,
    children: null,
    parent: 'product',
    card: {
      _id: 'asdo113333',
      question: '7 How is Guru doing?'
    }
  },
  'product-card-8': {
    id: 'product-card-8',
    name: null,
    children: null,
    parent: 'product',
    card: {
      _id: 'asdo113333',
      question: '8 How is Guru doing?'
    }
  },
  'product-card-9': {
    id: 'product-card-9',
    name: null,
    children: null,
    parent: 'product',
    card: {
      _id: 'asdo113333',
      question: '9 How is Guru doing?'
    }
  },
  'company-card-1': {
    id: 'company-card-1',
    name: null,
    children: null,
    parent: 'product',
    card: {
      _id: 'asdo113333',
      question: 'How is Guru doing?'
    }
  }
};

// "Autopopulate"
Object.values(MOCK_DIRECTORY_LOOKUP).forEach((node) => {
  if (node.parent) {
    node.parent = MOCK_DIRECTORY_LOOKUP[node.parent];
  }

  if (node.children) {
    node.children = node.children.map((child) => MOCK_DIRECTORY_LOOKUP[child]);
  }
});

const initialState = {
  history: [MOCK_DIRECTORY_LOOKUP.root],
  searchText: '',
  selectedIndices: []
};

export default function finderReducer(state = initialState, action) {
  const { type, payload = {} } = action;

  switch (type) {
    case types.GO_BACK_FINDER: {
      const { history } = state;
      return { ...state, history: history.slice(0, history.length - 1), selectedIndices: [] };
    }
    case types.PUSH_FINDER_PATH: {
      const { path } = payload;
      return {
        ...state,
        history: [...state.history, path || MOCK_DIRECTORY_LOOKUP.root],
        selectedIndices: []
      };
    }

    case types.SELECT_FINDER_NODE_INDEX: {
      const { index } = payload;
      return { ...state, selectedIndices: [index] };
    }
    case types.TOGGLE_SELECTED_FINDER_NODE_INDEX: {
      const { index } = payload;
      let { selectedIndices } = state;
      if (selectedIndices.some((selectedIndex) => selectedIndex === index)) {
        // Remove node
        selectedIndices = _.difference(selectedIndices, [index]);
      } else {
        // Add node
        selectedIndices = _.union(selectedIndices, index);
      }
      return { ...state, selectedIndices };
    }

    case types.UPDATE_FINDER_SEARCH_TEXT: {
      const { text } = payload;
      return { ...state, searchText: text };
    }
    default:
      return state;
  }
}

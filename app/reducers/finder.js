import _ from 'lodash';
import * as types from 'actions/actionTypes';
import { ROOT, PATH_TYPE } from 'appConstants/finder';

const BASE_ACTIVE_NODE = {
  parent: null,
  name: null,
  children: []
};

const initialState = {
  history: [{ _id: ROOT, type: PATH_TYPE.NODE }],
  activeNode: BASE_ACTIVE_NODE,
  searchText: '',
  selectedIndices: []
};

export default function finderReducer(state = initialState, action) {
  const { type, payload = {} } = action;

  const pushToHistory = (pathType, pathId, pathState={}) => {
    const { history } = state;
    const prevPath = _.last(history);

    if (pathType === prevPath.type && pathId === prevPath._id) {
      return state;
    }

    return {
      ...state,
      history: [...state.history, { _id: pathId, type: pathType, state: pathState }],
      selectedIndices: []
    };
  };

  switch (type) {
    case types.GO_BACK_FINDER: {
      const { history, activeNode } = state;
      const newHistory = history.slice(0, history.length - 1);

      let newActiveNode =  activeNode;
      if (newHistory.length !== 0 && _.last(newHistory).type === PATH_TYPE.SEGMENT) {
        newActiveNode = BASE_ACTIVE_NODE;
      }

      return { ...state, history: newHistory, activeNode: newActiveNode, selectedIndices: [] };
    }
    case types.PUSH_FINDER_NODE: {
      const { nodeId } = payload;
      return pushToHistory(PATH_TYPE.NODE, nodeId);
    }
    case types.PUSH_FINDER_SEGMENT: {
      const { segmentId, segmentName } = payload;
      const newState = pushToHistory(PATH_TYPE.SEGMENT, segmentId, { name: segmentName });
      return { ...newState, activeNode: BASE_ACTIVE_NODE };
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

    case types.GET_FINDER_NODE_REQUEST: {
      return { ...state, isGettingNode: true, getNodeError: null };
    }
    case types.GET_FINDER_NODE_SUCCESS: {
      const { node } = payload;
      return { ...state, isGettingNode: false, activeNode: node };
    }
    case types.GET_FINDER_NODE_ERROR: {
      const { error } = payload;
      return { ...state, isGettingNode: false, getNodeError: error };
    }

    default:
      return state;
  }
}

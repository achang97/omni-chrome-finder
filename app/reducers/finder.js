import _ from 'lodash';
import * as types from 'actions/actionTypes';
import { updateIndex } from 'utils/array';
import { ROOT, PATH_TYPE, MODAL_TYPE } from 'appConstants/finder';
import { PERMISSION_OPTIONS } from 'appConstants/card';

const BASE_ACTIVE_NODE = {
  parent: null,
  name: null,
  children: []
};

const BASE_FOLDER_STATE = {
  name: '',
  permissions: PERMISSION_OPTIONS[0],
  permissionGroups: []
};

const BASE_MODAL_OPEN_STATE = _.mapValues(MODAL_TYPE, () => false);

const initialState = {
  history: [{ _id: ROOT, type: PATH_TYPE.NODE, state: { searchText: '' } }],
  activeNode: BASE_ACTIVE_NODE,
  modalOpen: BASE_MODAL_OPEN_STATE,
  edits: {
    folder: BASE_FOLDER_STATE
  },
  selectedIndices: []
};

export default function finderReducer(state = initialState, action) {
  const { type, payload = {} } = action;

  const pushToHistory = (pathType, pathId, pathState = {}) => {
    const { history } = state;
    const prevPath = _.last(history);

    if (pathType === prevPath.type && pathId === prevPath._id) {
      return state;
    }

    const newPath = { _id: pathId, type: pathType, state: { searchText: '', ...pathState } };
    return {
      ...state,
      history: [...state.history, newPath],
      selectedIndices: []
    };
  };

  switch (type) {
    case types.GO_BACK_FINDER: {
      const { history, activeNode } = state;
      const newHistory = history.slice(0, history.length - 1);

      let newActiveNode = activeNode;
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

    case types.UPDATE_SELECTED_FINDER_INDICES: {
      const { indices } = payload;
      return { ...state, selectedIndices: indices };
    }

    case types.UPDATE_FINDER_SEARCH_TEXT: {
      const { text } = payload;
      const { history } = state;

      const activePath = _.last(history);
      const newPath = { ...activePath, state: { ...activePath.state, searchText: text } };
      const newHistory = updateIndex(history, history.length - 1, newPath);
      return { ...state, history: newHistory, selectedIndices: [] };
    }

    case types.UPDATE_FINDER_FOLDER_NAME: {
      const { name } = payload;
      return { ...state, edits: { folder: { ...state.edits.folder, name } } };
    }
    case types.UPDATE_FINDER_FOLDER_PERMISSIONS: {
      const { permissions } = payload;
      return { ...state, edits: { folder: { ...state.edits.folder, permissions } } };
    }
    case types.UPDATE_FINDER_FOLDER_PERMISSION_GROUPS: {
      const { permissionGroups } = payload;
      return { ...state, edits: { folder: { ...state.edits.folder, permissionGroups } } };
    }

    case types.OPEN_FINDER_MODAL: {
      const { modalType } = payload;

      const newState = { ...state, modalOpen: { ...state.modalOpen, [modalType]: true } };
      switch (modalType) {
        case MODAL_TYPE.CREATE_FOLDER: {
          newState.edits = { ...newState.edits, folder: BASE_FOLDER_STATE };
          break;
        }
        default:
          break;
      }

      return newState;
    }
    case types.CLOSE_FINDER_MODAL: {
      const { modalType } = payload;
      return { ...state, modalOpen: { ...state.modalOpen, [modalType]: false } };
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

    case types.CREATE_FINDER_FOLDER_REQUEST: {
      return { ...state, isCreatingFolder: true, createFolderError: null };
    }
    case types.CREATE_FINDER_FOLDER_SUCCESS: {
      return {
        ...state,
        isCreatingFolder: false,
        modalOpen: { ...state.modalOpen, [MODAL_TYPE.CREATE_FOLDER]: false }
      };
    }
    case types.CREATE_FINDER_FOLDER_ERROR: {
      const { error } = payload;
      return { ...state, isCreatingFolder: false, createFolderError: error };
    }

    default:
      return state;
  }
}

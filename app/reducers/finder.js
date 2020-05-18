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
  selectedNodeIds: [],
  draggingNodeId: null,
  moveNodeIds: [],
  moveSource: null,
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
      selectedNodeIds: []
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

      return { ...state, history: newHistory, activeNode: newActiveNode, selectedNodeIds: [] };
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

    case types.UPDATE_SELECTED_FINDER_NODES: {
      const { nodeIds } = payload;
      return { ...state, selectedNodeIds: nodeIds };
    }
    case types.UPDATE_DRAGGING_FINDER_NODE: {
      const { nodeId } = payload;
      return{ ...state, draggingNodeId: nodeId };
    }

    case types.UPDATE_FINDER_SEARCH_TEXT: {
      const { text } = payload;
      const { history } = state;

      const activePath = _.last(history);
      const newPath = { ...activePath, state: { ...activePath.state, searchText: text } };
      const newHistory = updateIndex(history, history.length - 1, newPath);
      return { ...state, history: newHistory, selectedNodeIds: [] };
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

    case types.START_MOVE_FINDER_NODES: {
      return { ...state, moveNodeIds: state.selectedNodeIds, moveSource: state.activeNode, selectedNodeIds: [] };
    }
    case types.CANCEL_MOVE_FINDER_NODES: {
      const { selectedNodeIds, activeNode: { children } } = state;
      const newSelectedNodeIds = selectedNodeIds.filter((id) => (
        children.some(({ _id: childId }) => childId === id)
      ));
      return { ...state, moveNodeIds: [], moveSource: null, selectedNodeIds: newSelectedNodeIds }; 
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

    case types.UPDATE_FINDER_FOLDER_REQUEST: {
      return { ...state, isUpdatingFolder: true, updateFolderError: null };
    }
    case types.UPDATE_FINDER_FOLDER_SUCCESS: {
      return {
        ...state,
        isUpdatingFolder: false,
        modalOpen: { ...state.modalOpen, [MODAL_TYPE.EDIT_FOLDER]: false }
      };
    }
    case types.UPDATE_FINDER_FOLDER_ERROR: {
      const { error } = payload;
      return { ...state, isUpdatingFolder: false, updateFolderError: error }
    }

    case types.MOVE_FINDER_NODES_REQUEST: {
      return { ...state, isMovingNodes: true, moveNodesError: null };
    }
    case types.MOVE_FINDER_NODES_SUCCESS: {
      return { ...state, isMovingNodes: false, moveNodeIds: [], moveSource: null };
    }
    case types.MOVE_FINDER_NODES_ERROR: {
      const { error } = payload;
      return { ...state, isMovingNodes: false, moveNodesError: error }
    }

    case types.DELETE_FINDER_NODES_REQUEST:
    case types.BULK_DELETE_FINDER_CARDS_REQUEST: {
      return { ...state, isDeletingNodes: true, deleteNodesError: null };
    }
    case types.DELETE_FINDER_NODES_SUCCESS:
    case types.BULK_DELETE_FINDER_CARDS_SUCCESS: {
      return {
        ...state,
        isDeletingNodes: false,
        modalOpen: { ...state.modalOpen, [MODAL_TYPE.CONFIRM_DELETE]: false }
      };
    }
    case types.DELETE_FINDER_NODES_ERROR:
    case types.BULK_DELETE_FINDER_CARDS_ERROR: {
      const { error } = payload;
      return { ...state, isDeletingNodes: false, deleteNodesError: error };
    }

    default:
      return state;
  }
}

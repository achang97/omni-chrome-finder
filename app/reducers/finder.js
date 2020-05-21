import _ from 'lodash';
import * as types from 'actions/actionTypes';
import { updateIndex } from 'utils/array';
import { convertPermissionsToFrontendFormat } from 'utils/card';
import { MAIN_STATE_ID, ROOT, PATH_TYPE, MODAL_TYPE } from 'appConstants/finder';
import { PERMISSION_OPTIONS } from 'appConstants/card';

const createBasePath = (nodeId) => {
  return { _id: nodeId, type: PATH_TYPE.NODE, state: { searchText: '' } };
};

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

const BASE_FINDER_STATE = {
  history: [createBasePath(ROOT.ID)],
  activeNode: BASE_ACTIVE_NODE,
  modalOpen: BASE_MODAL_OPEN_STATE,
  edits: {
    folder: BASE_FOLDER_STATE
  },
  selectedNodes: [],
  draggingNode: null,
  moveNodes: [],
  moveSource: null
};

const initialState = {
  [MAIN_STATE_ID]: BASE_FINDER_STATE
};

export default function finderReducer(state = initialState, action) {
  const { type, payload = {} } = action;

  const updateStateById = (finderId, getNewState) => {
    const currIdState = state[finderId] || BASE_FINDER_STATE;
    return { ...state, [finderId]: { ...currIdState, ...getNewState(currIdState) } };
  };

  const pushToHistory = (history, pathType, pathId, pathState = {}) => {
    const prevPath = _.last(history);

    if (pathType === prevPath.type && pathId === prevPath._id) {
      return {};
    }

    const newPath = { _id: pathId, type: pathType, state: { searchText: '', ...pathState } };
    return { history: [...history, newPath], selectedNodes: [] };
  };

  switch (type) {
    // Handle Card Closing Tabs
    case types.CLOSE_ALL_CARDS: {
      return initialState;
    }

    case types.INIT_FINDER: {
      const { finderId, nodeId } = payload;
      if (state[finderId]) {
        return state;
      }

      const history = [createBasePath(nodeId)];
      return { ...state, [finderId]: { ...BASE_FINDER_STATE, history } };
    }
    case types.CLOSE_FINDER: {
      const { finderId } = payload;
      return _.omit(state, finderId);
    }

    case types.GO_BACK_FINDER: {
      const { finderId } = payload;
      return updateStateById(finderId, ({ history, activeNode }) => {
        if (history.length <= 1) {
          return null;
        }

        const newHistory = history.slice(0, history.length - 1);

        let newActiveNode = activeNode;
        if (newHistory.length !== 0 && _.last(newHistory).type === PATH_TYPE.SEGMENT) {
          newActiveNode = BASE_ACTIVE_NODE;
        }

        return { history: newHistory, activeNode: newActiveNode, selectedNodes: [] };
      });
    }
    case types.PUSH_FINDER_NODE: {
      const { finderId, nodeId } = payload;
      return updateStateById(finderId, ({ history }) => {
        return pushToHistory(history, PATH_TYPE.NODE, nodeId);
      });
    }
    case types.PUSH_FINDER_SEGMENT: {
      const { finderId, segmentId, segmentName } = payload;
      return updateStateById(finderId, ({ history }) => {
        const newPathState = { name: segmentName };
        const newState = pushToHistory(history, PATH_TYPE.SEGMENT, segmentId, newPathState);
        return { ...newState, activeNode: BASE_ACTIVE_NODE };
      });
    }

    case types.UPDATE_SELECTED_FINDER_NODES: {
      const { finderId, nodes } = payload;
      return updateStateById(finderId, () => ({ selectedNodes: nodes }));
    }
    case types.UPDATE_DRAGGING_FINDER_NODE: {
      const { finderId, node } = payload;
      return updateStateById(finderId, () => ({ draggingNode: node }));
    }

    case types.UPDATE_FINDER_SEARCH_TEXT: {
      const { finderId, text } = payload;
      return updateStateById(finderId, (currState) => {
        const { history } = currState;
        const activePath = _.last(history);

        const newPath = { ...activePath, state: { ...activePath.state, searchText: text } };
        const newHistory = updateIndex(history, history.length - 1, newPath);

        return { history: newHistory, selectedNodes: [] };
      });
    }

    case types.UPDATE_FINDER_FOLDER_NAME: {
      const { finderId, name } = payload;
      return updateStateById(finderId, ({ edits }) => ({
        edits: { folder: { ...edits.folder, name } }
      }));
    }
    case types.UPDATE_FINDER_FOLDER_PERMISSIONS: {
      const { finderId, permissions } = payload;
      return updateStateById(finderId, ({ edits }) => ({
        edits: { folder: { ...edits.folder, permissions } }
      }));
    }
    case types.UPDATE_FINDER_FOLDER_PERMISSION_GROUPS: {
      const { finderId, permissionGroups } = payload;
      return updateStateById(finderId, ({ edits }) => ({
        edits: { folder: { ...edits.folder, permissionGroups } }
      }));
    }

    case types.OPEN_FINDER_MODAL: {
      const { finderId, modalType } = payload;
      return updateStateById(finderId, ({ modalOpen }) => {
        const newState = { modalOpen: { ...modalOpen, [modalType]: true } };
        switch (modalType) {
          case MODAL_TYPE.CREATE_FOLDER: {
            newState.edits = { ...newState.edits, folder: BASE_FOLDER_STATE };
            break;
          }
          default:
            break;
        }

        return newState;
      });
    }
    case types.CLOSE_FINDER_MODAL: {
      const { finderId, modalType } = payload;
      return updateStateById(finderId, ({ modalOpen }) => ({
        modalOpen: { ...modalOpen, [modalType]: false }
      }));
    }

    case types.START_MOVE_FINDER_NODES: {
      const { finderId } = payload;
      return updateStateById(finderId, ({ selectedNodes, activeNode }) => ({
        moveNodes: selectedNodes,
        moveSource: activeNode,
        selectedNodes: []
      }));
    }
    case types.CANCEL_MOVE_FINDER_NODES: {
      const { finderId } = payload;
      return updateStateById(finderId, ({ moveNodes, activeNode: { children } }) => {
        const newSelectedNodes = moveNodes.filter(({ _id }) =>
          children.some(({ _id: childId }) => childId === _id)
        );
        return { ...state, moveNodes: [], moveSource: null, selectedNodes: newSelectedNodes };
      });
    }

    case types.GET_FINDER_NODE_REQUEST: {
      const { finderId } = payload;
      return updateStateById(finderId, () => ({ isGettingNode: true, getNodeError: null }));
    }
    case types.GET_FINDER_NODE_SUCCESS: {
      const { finderId, node } = payload;
      node.children = node.children.map(({ userPermissions, permissionGroups, ...rest }) => {
        const permissions = convertPermissionsToFrontendFormat(userPermissions, permissionGroups);
        return { ...rest, permissions, permissionGroups };
      });
      return updateStateById(finderId, () => ({ isGettingNode: false, activeNode: node }));
    }
    case types.GET_FINDER_NODE_ERROR: {
      const { finderId, error } = payload;
      return updateStateById(finderId, ({ modalOpen }) => ({
        isGettingNode: false,
        getNodeError: error,
        modalOpen: { ...modalOpen, [MODAL_TYPE.ERROR_GET]: true }
      }));
    }

    case types.CREATE_FINDER_FOLDER_REQUEST: {
      const { finderId } = payload;
      return updateStateById(finderId, () => ({ isCreatingFolder: true, createFolderError: null }));
    }
    case types.CREATE_FINDER_FOLDER_SUCCESS: {
      const { finderId } = payload;
      return updateStateById(finderId, ({ modalOpen }) => ({
        isCreatingFolder: false,
        modalOpen: { ...modalOpen, [MODAL_TYPE.CREATE_FOLDER]: false }
      }));
    }
    case types.CREATE_FINDER_FOLDER_ERROR: {
      const { finderId, error } = payload;
      return updateStateById(finderId, () => ({
        isCreatingFolder: false,
        createFolderError: error
      }));
    }

    case types.UPDATE_FINDER_FOLDER_REQUEST: {
      const { finderId } = payload;
      return updateStateById(finderId, () => ({ isUpdatingFolder: true, updateFolderError: null }));
    }
    case types.UPDATE_FINDER_FOLDER_SUCCESS: {
      const { finderId } = payload;
      return updateStateById(finderId, ({ modalOpen }) => ({
        isUpdatingFolder: false,
        modalOpen: { ...modalOpen, [MODAL_TYPE.EDIT_FOLDER]: false }
      }));
    }
    case types.UPDATE_FINDER_FOLDER_ERROR: {
      const { finderId, error } = payload;
      return updateStateById(finderId, () => ({
        isUpdatingFolder: false,
        updateFolderError: error
      }));
    }

    case types.MOVE_FINDER_NODES_REQUEST: {
      const { finderId } = payload;
      return updateStateById(finderId, () => ({ isMovingNodes: true, moveNodesError: null }));
    }
    case types.MOVE_FINDER_NODES_SUCCESS: {
      const { finderId } = payload;
      return updateStateById(finderId, () => ({
        isMovingNodes: false,
        moveNodes: [],
        moveSource: null
      }));
    }
    case types.MOVE_FINDER_NODES_ERROR: {
      const { finderId, error } = payload;
      return updateStateById(finderId, ({ modalOpen }) => ({
        isMovingNodes: false,
        moveNodesError: error,
        modalOpen: { ...modalOpen, [MODAL_TYPE.ERROR_MOVE]: true }
      }));
    }

    case types.DELETE_FINDER_NODES_REQUEST: {
      const { finderId } = payload;
      return updateStateById(finderId, () => ({ isDeletingNodes: true, deleteNodesError: null }));
    }
    case types.DELETE_FINDER_NODES_SUCCESS: {
      const { finderId } = payload;
      return updateStateById(finderId, ({ modalOpen }) => ({
        isDeletingNodes: false,
        modalOpen: { ...modalOpen, [MODAL_TYPE.CONFIRM_DELETE]: false }
      }));
    }
    case types.DELETE_FINDER_NODES_ERROR: {
      const { finderId, error } = payload;
      return updateStateById(finderId, () => ({ isDeletingNodes: false, deleteNodesError: error }));
    }

    default:
      return state;
  }
}

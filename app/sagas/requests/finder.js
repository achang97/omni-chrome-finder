import { take, all, call, fork, put, select } from 'redux-saga/effects';
import _ from 'lodash';
import { doGet, doPut, doPost, doDelete, getErrorMessage } from 'utils/request';
import { getArrayIds } from 'utils/array';
import { convertPermissionsToBackendFormat } from 'utils/card';
import {
  GET_FINDER_NODE_REQUEST,
  CREATE_FINDER_FOLDER_REQUEST,
  UPDATE_FINDER_FOLDER_REQUEST,
  DELETE_FINDER_NODES_REQUEST,
  MOVE_FINDER_NODES_REQUEST
} from 'actions/actionTypes';
import {
  requestGetFinderNode,
  handleGetFinderNodeSuccess,
  handleGetFinderNodeError,
  handleCreateFinderFolderSuccess,
  handleCreateFinderFolderError,
  handleUpdateFinderFolderSuccess,
  handleUpdateFinderFolderError,
  handleDeleteFinderNodesSuccess,
  handleDeleteFinderNodesError,
  handleMoveFinderNodesSuccess,
  handleMoveFinderNodesError
} from 'actions/finder';
import { ROOT, FINDER_TYPE, PATH_TYPE, SEARCH_TYPE } from 'appConstants/finder';
import AUDIT from 'appConstants/audit';

export default function* watchFinderRequests() {
  while (true) {
    const action = yield take([
      GET_FINDER_NODE_REQUEST,
      CREATE_FINDER_FOLDER_REQUEST,
      UPDATE_FINDER_FOLDER_REQUEST,
      DELETE_FINDER_NODES_REQUEST,
      MOVE_FINDER_NODES_REQUEST
    ]);

    const { type, payload } = action;
    switch (type) {
      case GET_FINDER_NODE_REQUEST: {
        yield fork(getNode, payload);
        break;
      }
      case CREATE_FINDER_FOLDER_REQUEST: {
        yield fork(createFolder, payload);
        break;
      }
      case UPDATE_FINDER_FOLDER_REQUEST: {
        yield fork(updateFolder, payload);
        break;
      }
      case DELETE_FINDER_NODES_REQUEST: {
        yield fork(deleteNodes, payload);
        break;
      }
      case MOVE_FINDER_NODES_REQUEST: {
        yield fork(moveNodes, payload);
        break;
      }
      default: {
        break;
      }
    }
  }
}

function* getParentNode(finderId) {
  const finderHistory = yield select((state) => state.finder[finderId].history);
  const parentNode = _.last(finderHistory);
  return parentNode;
}

function* getFolderEdits(finderId) {
  const {
    finder: {
      [finderId]: {
        edits: {
          folder: { name, permissions, permissionGroups }
        }
      }
    },
    profile: {
      user: { _id: userId }
    }
  } = yield select((state) => state);

  const permissionsInfo = convertPermissionsToBackendFormat(userId, permissions, permissionGroups);
  return { ...permissionsInfo, name };
}

function groupNodeIds(selectedNodes) {
  const groupedNodes = _.groupBy(selectedNodes, 'finderType');

  const groupedNodeIds = {};
  Object.values(FINDER_TYPE).forEach((nodeType) => {
    const nodes = groupedNodes[nodeType] || [];
    groupedNodeIds[nodeType] = getArrayIds(nodes);
  });

  return groupedNodeIds;
}

function* getGroupedSelectedNodeIds(finderId) {
  const selectedNodes = yield select((state) => state.finder[finderId].selectedNodes);
  return groupNodeIds(selectedNodes);
}

function* getNode({ finderId }) {
  try {
    const { _id: nodeId, source, baseLogId } = yield call(getParentNode, finderId);
    const { history: finderHistory } = yield select((state) => state.finder[finderId]);
    const {
      state: { searchText, searchType }
    } = _.last(finderHistory);

    let node;
    if (nodeId === ROOT.ID) {
      node = { _id: ROOT.ID, name: ROOT.NAME };
    } else {
      node = yield call(doGet, `/finder/node/${nodeId}`, { source, baseLogId });
    }

    let nodeChildren = [];
    let searchAuditLogId;

    switch (searchType) {
      case SEARCH_TYPE.ALL_FOLDERS: {
        const { results, auditLogId } = yield call(doGet, '/search/all', {
          types: ['card', 'finder'].join(','),
          q: searchText,
          source: AUDIT.SOURCE.FINDER
        });
        const [{ items: cards }, { items: nodes }] = results;

        nodeChildren = _.concat(
          nodes.map((currNode) => ({ ...currNode, finderType: FINDER_TYPE.NODE })),
          cards.map((card) => ({ ...card, finderType: FINDER_TYPE.CARD }))
        );
        searchAuditLogId = auditLogId;
        break;
      }
      case SEARCH_TYPE.CURRENT_FOLDER:
      default: {
        const query = {
          q: searchText,
          source: AUDIT.SOURCE.FINDER,
          orderBy: !searchText ? 'name' : null
        };
        const { content, auditLogId } = yield call(doGet, `/finder/node/${nodeId}/content`, query);

        nodeChildren = content;
        searchAuditLogId = auditLogId;
        break;
      }
    }

    const fullNode = { ...node, children: nodeChildren, auditLogId: searchAuditLogId };
    yield put(handleGetFinderNodeSuccess(finderId, fullNode));
  } catch (error) {
    yield put(handleGetFinderNodeError(finderId, getErrorMessage(error)));
  }
}

function* createFolder({ finderId }) {
  try {
    const newFolderInfo = yield call(getFolderEdits, finderId);
    const { _id: parentNodeId } = yield call(getParentNode, finderId);
    yield call(doPost, `/finder/node/${parentNodeId}/createFolder`, newFolderInfo);

    yield put(requestGetFinderNode(finderId));
    yield put(handleCreateFinderFolderSuccess(finderId));
  } catch (error) {
    yield put(handleCreateFinderFolderError(finderId, getErrorMessage(error)));
  }
}

function* updateFolder({ finderId }) {
  try {
    const update = yield call(getFolderEdits, finderId);
    const selectedNodes = yield select((state) => state.finder[finderId].selectedNodes);

    const selectedNodeId = selectedNodes[0]._id;
    const updatedFolder = yield call(doPut, `/finder/node/${selectedNodeId}`, update);

    yield put(requestGetFinderNode(finderId));
    yield put(handleUpdateFinderFolderSuccess(finderId, updatedFolder));
  } catch (error) {
    yield put(handleUpdateFinderFolderError(finderId, getErrorMessage(error)));
  }
}

function* deleteNodes({ finderId }) {
  try {
    const groupedNodeIds = yield call(getGroupedSelectedNodeIds, finderId);
    const { type: parentNodeType } = yield call(getParentNode, finderId);

    const { [FINDER_TYPE.NODE]: nodeIds, [FINDER_TYPE.CARD]: cardIds } = groupedNodeIds;

    const requests = nodeIds.map((nodeId) => call(doDelete, `/finder/node/${nodeId}`));
    if (cardIds.length) {
      requests.push(call(doDelete, `/cards/bulk`, cardIds));
    }
    yield all(requests);

    // Confirm presence in node view before attempted reload
    if (parentNodeType === PATH_TYPE.NODE) {
      yield put(requestGetFinderNode(finderId));
    }

    yield put(handleDeleteFinderNodesSuccess(finderId, nodeIds, cardIds));
  } catch (error) {
    yield put(handleDeleteFinderNodesError(finderId, getErrorMessage(error)));
  }
}

function* moveNodes({ finderId, nodes, destinationId }) {
  try {
    const groupedNodeIds = groupNodeIds(nodes);
    yield all([
      ...groupedNodeIds[FINDER_TYPE.NODE].map((nodeId) =>
        call(doPost, `/finder/node/${nodeId}/move`, { destinationFinderNodeId: destinationId })
      ),
      ...groupedNodeIds[FINDER_TYPE.CARD].map((cardId) =>
        call(doPost, `/finder/card/${cardId}/move`, { destinationFinderNodeId: destinationId })
      )
    ]);
    yield put(requestGetFinderNode(finderId));
    yield put(handleMoveFinderNodesSuccess(finderId));
  } catch (error) {
    yield put(handleMoveFinderNodesError(finderId, getErrorMessage(error)));
  }
}

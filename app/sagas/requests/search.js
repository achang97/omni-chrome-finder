import { CancelToken, isCancel } from 'axios';
import { take, call, fork, put, select } from 'redux-saga/effects';
import { doGet, doPost, getErrorMessage } from 'utils/request';
import { SEARCH } from 'appConstants';
import {
  SEARCH_CARDS_REQUEST,
  SEARCH_NODES_REQUEST,
  SEARCH_INTEGRATIONS_REQUEST,
  SEARCH_TAGS_REQUEST,
  SEARCH_USERS_REQUEST,
  SEARCH_PERMISSION_GROUPS_REQUEST,
  SEARCH_INVITED_USERS_REQUEST
} from 'actions/actionTypes';
import {
  handleSearchCardsSuccess,
  handleSearchCardsError,
  handleSearchNodesSuccess,
  handleSearchNodesError,
  handleSearchIntegrationsSuccess,
  handleSearchIntegrationsError,
  handleSearchTagsSuccess,
  handleSearchTagsError,
  handleSearchUsersSuccess,
  handleSearchUsersError,
  handleSearchPermissionGroupsSuccess,
  handleSearchPermissionGroupsError,
  handleSearchInvitedUsersSuccess,
  handleSearchInvitedUsersError
} from 'actions/search';

const CANCEL_TYPE = {
  CARDS: 'CARDS',
  NODES: 'NODES',
  INTEGRATIONS: 'INTEGRATIONS',
  TAGS: 'TAGS',
  USERS: 'USERS',
  PERMISSION_GROUPS: 'PERMISSION_GROUPS'
};

const CANCEL_SOURCE = {};

export default function* watchSearchRequests() {
  while (true) {
    const action = yield take([
      SEARCH_CARDS_REQUEST,
      SEARCH_NODES_REQUEST,
      SEARCH_INTEGRATIONS_REQUEST,
      SEARCH_TAGS_REQUEST,
      SEARCH_USERS_REQUEST,
      SEARCH_PERMISSION_GROUPS_REQUEST,
      SEARCH_INVITED_USERS_REQUEST
    ]);

    const { type, payload } = action;
    switch (type) {
      case SEARCH_CARDS_REQUEST: {
        yield fork(searchCards, payload);
        break;
      }
      case SEARCH_NODES_REQUEST: {
        yield fork(searchNodes, payload);
        break;
      }
      case SEARCH_INTEGRATIONS_REQUEST: {
        yield fork(searchIntegrations, payload);
        break;
      }
      case SEARCH_TAGS_REQUEST: {
        yield fork(searchTags, payload);
        break;
      }
      case SEARCH_USERS_REQUEST: {
        yield fork(searchUsers, payload);
        break;
      }
      case SEARCH_PERMISSION_GROUPS_REQUEST: {
        yield fork(searchPermissionGroups, payload);
        break;
      }
      case SEARCH_INVITED_USERS_REQUEST: {
        yield fork(searchInvitedUsers);
        break;
      }
      default: {
        break;
      }
    }
  }
}

function cancelRequest(cancelType) {
  if (CANCEL_SOURCE[cancelType]) {
    CANCEL_SOURCE[cancelType].cancel();
  }

  CANCEL_SOURCE[cancelType] = CancelToken.source();
  return CANCEL_SOURCE[cancelType].token;
}

function* searchCards({ type, query, clearCards }) {
  const cancelToken = cancelRequest(CANCEL_TYPE.CARDS);

  if (!query) {
    // eslint-disable-next-line no-param-reassign
    query = yield select((state) => state.search.cards[type].oldQuery);
  }

  try {
    const page = yield select((state) => state.search.cards[type].page);
    let cards = [];

    if (!query.ids || query.ids.length !== 0) {
      const body = {
        ...query,
        page,
        limit: SEARCH.PAGE_SIZE,
        orderBy: !query.q ? 'question' : null
      };

      if (type === SEARCH.TYPE.AUTOFIND) {
        cards = yield call(doPost, '/suggest', body, { cancelToken });
      } else {
        cards = yield call(doGet, '/cards/query', body, { cancelToken });
      }
    }

    yield put(handleSearchCardsSuccess(type, cards, clearCards));
  } catch (error) {
    if (!isCancel(error)) {
      yield put(handleSearchCardsError(type, getErrorMessage(error)));
    }
  }
}

function* searchNodes({ query }) {
  const cancelToken = cancelRequest(CANCEL_TYPE.NODES);

  try {
    const nodes = yield call(doGet, '/finder/node/query', { q: query }, { cancelToken });
    yield put(handleSearchNodesSuccess(nodes));
  } catch (error) {
    if (!isCancel(error)) {
      yield put(handleSearchNodesError(getErrorMessage(error)));
    }
  }
}

function* searchIntegrations({ query }) {
  const cancelToken = cancelRequest(CANCEL_TYPE.INTEGRATIONS);

  try {
    const results = yield call(doGet, '/search/integrations', { q: query }, { cancelToken });
    yield put(handleSearchIntegrationsSuccess(results));
  } catch (error) {
    if (!isCancel(error)) {
      yield put(handleSearchIntegrationsError(getErrorMessage(error)));
    }
  }
}

function* searchTags({ name }) {
  const cancelToken = cancelRequest(CANCEL_TYPE.TAGS);

  try {
    const tags = yield call(doGet, '/tags/query', { q: name }, { cancelToken });
    yield put(handleSearchTagsSuccess(tags));
  } catch (error) {
    if (!isCancel(error)) {
      yield put(handleSearchTagsError(getErrorMessage(error)));
    }
  }
}

function* searchUsers({ name }) {
  const cancelToken = cancelRequest(CANCEL_TYPE.USERS);

  try {
    const users = yield call(doGet, '/users/queryByName', { q: name }, { cancelToken });
    yield put(handleSearchUsersSuccess(users));
  } catch (error) {
    if (!isCancel(error)) {
      yield put(handleSearchUsersError(getErrorMessage(error)));
    }
  }
}

function* searchPermissionGroups({ name }) {
  const cancelToken = cancelRequest(CANCEL_TYPE.PERMISSION_GROUPS);

  try {
    const permissionGroups = yield call(
      doGet,
      '/permissionGroups/query',
      { name },
      { cancelToken }
    );
    yield put(handleSearchPermissionGroupsSuccess(permissionGroups));
  } catch (error) {
    if (!isCancel(error)) {
      yield put(handleSearchPermissionGroupsError(getErrorMessage(error)));
    }
  }
}

function* searchInvitedUsers() {
  try {
    const invitedUsers = yield call(doGet, '/invitedUsers');
    yield put(handleSearchInvitedUsersSuccess(invitedUsers));
  } catch (error) {
    yield put(handleSearchInvitedUsersError(getErrorMessage(error)));
  }
}

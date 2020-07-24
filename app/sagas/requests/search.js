import { CancelToken, isCancel } from 'axios';
import { take, call, fork, put, select, all } from 'redux-saga/effects';
import { doGet, doPost, getErrorMessage } from 'utils/request';
import { SEARCH } from 'appConstants';
import {
  SEARCH_CARDS_REQUEST,
  SEARCH_INTEGRATIONS_REQUEST,
  SEARCH_TAGS_REQUEST,
  SEARCH_USERS_REQUEST,
  SEARCH_PERMISSION_GROUPS_REQUEST
} from 'actions/actionTypes';
import {
  handleSearchCardsSuccess,
  handleSearchCardsError,
  handleSearchNodesSuccess,
  handleSearchIntegrationsSuccess,
  handleSearchIndividualIntegrationSuccess,
  handleSearchIntegrationsError,
  handleSearchTagsSuccess,
  handleSearchTagsError,
  handleSearchUsersSuccess,
  handleSearchUsersError,
  handleSearchPermissionGroupsSuccess,
  handleSearchPermissionGroupsError
} from 'actions/search';

const CANCEL_TYPE = {
  CARDS: 'CARDS',
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
      SEARCH_INTEGRATIONS_REQUEST,
      SEARCH_TAGS_REQUEST,
      SEARCH_USERS_REQUEST,
      SEARCH_PERMISSION_GROUPS_REQUEST
    ]);

    const { type, payload } = action;
    switch (type) {
      case SEARCH_CARDS_REQUEST: {
        yield fork(searchCards, payload);
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

function* searchCards({ source, query, clearCards }) {
  const cancelToken = cancelRequest(`${CANCEL_TYPE.CARDS}-${source}`);

  if (!query) {
    // eslint-disable-next-line no-param-reassign
    query = yield select((state) => state.search.cards[source].oldQuery);
  }

  try {
    const page = yield select((state) => state.search.cards[source].page);

    let cards = [];
    let auditLogId;

    if (!query.ids || query.ids.length !== 0) {
      const body = {
        ...query,
        page,
        limit: SEARCH.PAGE_SIZE,
        orderBy: !query.q ? 'question' : null
      };

      switch (source) {
        case SEARCH.SOURCE.DOCK: {
          const params = { ...body, types: ['card', 'finder'].join(',') };
          const allResults = yield call(doGet, '/search/all', params, { cancelToken });

          // eslint-disable-next-line prefer-destructuring
          auditLogId = allResults.auditLogId;
          cards = allResults.results[0].items;

          // NOTE @achang97: This is pretty ugly, but I wanted to keep the functionality of
          // paginating cards while being able to create one unified search log in the BE.
          // This could be restructured in the future.
          const nodes = allResults.results[1].items;
          yield put(handleSearchNodesSuccess(nodes));

          break;
        }
        case SEARCH.SOURCE.AUTOFIND: {
          ({ cards, auditLogId } = yield call(doPost, '/suggest', body, { cancelToken }));
          break;
        }
        case SEARCH.SOURCE.SEGMENT:
        default: {
          ({ cards, auditLogId } = yield call(
            doGet,
            '/cards/query',
            { source, ...body },
            { cancelToken }
          ));
          break;
        }
      }
    }

    yield put(handleSearchCardsSuccess(source, cards, auditLogId, clearCards));
  } catch (error) {
    if (!isCancel(error)) {
      yield put(handleSearchCardsError(source, getErrorMessage(error)));
    }
  }
}

function* searchInvidividualIntegration(integration, query, cancelToken) {
  if (query) {
    const queryParams = { q: query, types: integration };
    const { results } = yield call(doGet, '/search/integrations', queryParams, { cancelToken });
    if (results.length !== 0) {
      yield put(handleSearchIndividualIntegrationSuccess(integration, results[0].items));
    }
  }
}

function* searchIntegrations({ query }) {
  const cancelToken = cancelRequest(CANCEL_TYPE.INTEGRATIONS);
  try {
    yield all(
      SEARCH.INTEGRATIONS.map(({ type }) => searchInvidividualIntegration(type, query, cancelToken))
    );
    yield put(handleSearchIntegrationsSuccess());
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

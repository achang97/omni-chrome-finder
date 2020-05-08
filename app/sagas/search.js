import { CancelToken, isCancel } from 'axios';
import { take, call, fork, all, put, select } from 'redux-saga/effects';
import { doGet, doPost, getErrorMessage } from 'utils/request';
import { isLoggedIn } from 'utils/auth';
import { SEARCH, INTEGRATIONS } from 'appConstants';
import {
  SEARCH_CARDS_REQUEST,
  SEARCH_TAGS_REQUEST,
  SEARCH_USERS_REQUEST,
  SEARCH_PERMISSION_GROUPS_REQUEST
} from 'actions/actionTypes';
import {
  handleSearchCardsSuccess,
  handleSearchCardsError,
  handleSearchTagsSuccess,
  handleSearchTagsError,
  handleSearchUsersSuccess,
  handleSearchUsersError,
  handleSearchPermissionGroupsSuccess,
  handleSearchPermissionGroupsError
} from 'actions/search';

const CANCEL_TYPE = {
  CARDS: 'CARDS',
  TAGS: 'TAGS',
  USERS: 'USERS',
  PERMISSION_GROUPS: 'PERMISSION_GROUPS'
};

const CANCEL_SOURCE = {};

const DOCUMENTATION_INTEGRATIONS = [
  {
    integration: INTEGRATIONS.GMAIL,
    url: '/gmail/messages/query'
  },
  {
    integration: INTEGRATIONS.GOOGLE,
    url: '/google/drive/query'
  },
  {
    integration: INTEGRATIONS.SLACK,
    url: '/slack/query'
  },
  {
    integration: INTEGRATIONS.ZENDESK,
    url: '/zendesk/tickets/query'
  }
];

export default function* watchSearchRequests() {
  let action;

  while (
    (action = yield take([
      SEARCH_CARDS_REQUEST,
      SEARCH_TAGS_REQUEST,
      SEARCH_USERS_REQUEST,
      SEARCH_PERMISSION_GROUPS_REQUEST
    ]))
  ) {
    const { type, payload } = action;
    switch (type) {
      case SEARCH_CARDS_REQUEST: {
        yield fork(searchCards, payload);
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

function* searchCards({ type, query, clearCards }) {
  const cancelToken = cancelRequest(CANCEL_TYPE.CARDS);

  if (!query) {
    query = yield select((state) => state.search.cards[type].oldQuery);
  }

  try {
    const page = yield select((state) => state.search.cards[type].page);
    const user = yield select((state) => state.profile.user);

    let cards = [];
    const externalResults = [];

    const allRequests = [];

    if (!query.ids || query.ids.length !== 0) {
      const body = { ...query, page };
      if (type === SEARCH.TYPE.AUTOFIND) {
        allRequests.push({ requestFn: doPost, url: '/suggest', body });
      } else {
        allRequests.push({ url: '/cards/query', body });
      }
    }

    if (type === SEARCH.TYPE.POPOUT && query.q !== '') {
      DOCUMENTATION_INTEGRATIONS.forEach(({ integration, url }) => {
        if (isLoggedIn(user, integration.type)) {
          allRequests.push({ url, integration, body: { q: query.q } });
        }
      });
    }

    const results = yield all(
      allRequests.map(({ requestFn, url, body }) =>
        call(requestFn || doGet, url, body, { cancelToken })
      )
    );

    if (results.length !== 0) {
      cards = results[0];
    }

    let i;
    for (i = 1; i < results.length; i++) {
      if (results[i].length !== 0) {
        externalResults.push({ integration: allRequests[i].integration, results: results[i] });
      }
    }

    yield put(handleSearchCardsSuccess(type, cards, externalResults, clearCards));
  } catch (error) {
    if (!isCancel(error)) {
      yield put(handleSearchCardsError(type, getErrorMessage(error)));
    }
  }
}

function* searchTags({ name }) {
  const cancelToken = cancelRequest(CANCEL_TYPE.TAGS);

  try {
    const { tags } = yield call(doPost, '/tags/queryNames', { name }, { cancelToken });
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
    const { users } = yield call(doPost, '/users/queryNames', { name }, { cancelToken });
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

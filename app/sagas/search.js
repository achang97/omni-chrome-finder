import { CancelToken, isCancel } from 'axios';
import { delay } from 'redux-saga';
import { take, call, fork, all, cancel, cancelled, put, select } from 'redux-saga/effects';
import { doGet, doPost, doPut, doDelete } from '../utils/request'
import { isLoggedIn } from '../utils/auth';
import { SEARCH_TYPE, INTEGRATIONS } from '../utils/constants';
import { SEARCH_CARDS_REQUEST, SEARCH_TAGS_REQUEST, SEARCH_USERS_REQUEST, SEARCH_PERMISSION_GROUPS_REQUEST,  } from '../actions/actionTypes';
import { 
  handleSearchCardsSuccess, handleSearchCardsError,
  handleSearchTagsSuccess, handleSearchTagsError,
  handleSearchUsersSuccess, handleSearchUsersError,
  handleSearchPermissionGroupsSuccess, handleSearchPermissionGroupsError,
} from '../actions/search';

const CANCEL_TYPE = {
  CARDS: 'CARDS',
  TAGS: 'TAGS',
  USERS: 'USERS',
  PERMISSION_GROUPS: 'PERMISSION_GROUPS',
};

const CANCEL_SOURCE = {};

const DOCUMENTATION_INTEGRATIONS = [
  {
    integration: INTEGRATIONS.GOOGLE,
    url: '/google/drive/query'
  },
  {
    integration: INTEGRATIONS.SLACK,
    url: '/slack/query'
  }
]

export default function* watchSearchRequests() {
  let action;

  while (action = yield take([SEARCH_CARDS_REQUEST, SEARCH_TAGS_REQUEST, SEARCH_USERS_REQUEST, SEARCH_PERMISSION_GROUPS_REQUEST])) {
    const { type, payload } = action;
    switch (type) {
      case SEARCH_CARDS_REQUEST: {
        yield fork(searchCards, payload)
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

  try {
    const page = yield select(state => state.search.cards[type].page);
    const user = yield select(state => state.profile.user);

    let cards = [];
    let externalResults = [];

    const allRequests = [];

    if (!query.ids || query.ids.length !== 0) {
      allRequests.push({ url: '/cards/query', body: { ...query, page } });
    }

    if (type === SEARCH_TYPE.POPOUT && query.q !== '') {
      DOCUMENTATION_INTEGRATIONS.forEach(({ integration, url }) => {
        if (isLoggedIn(user, integration)) {
          allRequests.push({ url, integration, body: { q: query.q } })
        }
      });
    }
    
    const results = yield all(allRequests.map(({ url, body }) => (
      call(doGet, url, body, { cancelToken })
    )));

    if (results.length !== 0) {
      cards = results[0];
    }

    let i;
    for (i = 1; i < results.length; i++) {
      externalResults.push({ integration: allRequests[i].integration, results: results[i] });
    }

    yield put(handleSearchCardsSuccess(type, cards, externalResults, clearCards));
  } catch(error) {
    if (!isCancel(error)) {
      const { response: { data } } = error;
      yield put(handleSearchCardsError(type, data.error));
    }
  }
}

function* searchTags({ name }) {
  const cancelToken = cancelRequest(CANCEL_TYPE.TAGS);

  try {
    const { tags } = yield call(doPost, '/tags/queryNames', { name }, { cancelToken });
    yield put(handleSearchTagsSuccess(tags));
  } catch(error) {
    if (!isCancel(error)) {
      const { response: { data } } = error;
      yield put(handleSearchTagsError(data.error));
    }
  }
}

function* searchUsers({ name }) {
  const cancelToken = cancelRequest(CANCEL_TYPE.USERS);

  try {
    const { users } = yield call(doPost, '/users/queryNames', { name }, { cancelToken });
    yield put(handleSearchUsersSuccess(users));
  } catch(error) {
    if (!isCancel(error)) {
      const { response: { data } } = error;
      yield put(handleSearchUsersError(data.error));
    }
  }
}

function* searchPermissionGroups({ name }) {
  const cancelToken = cancelRequest(CANCEL_TYPE.PERMISSION_GROUPS);

  try {
    const { permissiongroups } = yield call(doPost, '/permissiongroups/queryNames', { name }, { cancelToken });
    yield put(handleSearchPermissionGroupsSuccess(permissiongroups));
  } catch(error) {
    if (!isCancel(error)) {
      const { response: { data } } = error;
      yield put(handleSearchPermissionGroupsError(data.error));
    }
  }
}

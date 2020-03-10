import { CancelToken, isCancel } from 'axios';
import { delay } from 'redux-saga';
import { take, call, fork, all, cancel, cancelled, put, select } from 'redux-saga/effects';
import { doGet, doPost, doPut, doDelete } from '../utils/request'
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

function isLoggedIn(user, service) {
  return user && user.integrations[service].access_token;
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
    if (!query.ids || query.ids.length !== 0) {
      cards = yield call(doGet, '/cards/query', { ...query, page }, { cancelToken });
    }

    const externalResults = [];
    if (type === SEARCH_TYPE.POPOUT && query.q !== '' && isLoggedIn(user, INTEGRATIONS.GOOGLE)) {
      const googleResults = yield call(doGet, '/google/drive/query', { q: query.q }, { cancelToken });
      externalResults.push({ source: INTEGRATIONS.GOOGLE, results: googleResults });
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

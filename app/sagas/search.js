import { delay } from 'redux-saga';
import { take, call, fork, all, cancel, cancelled, put, select } from 'redux-saga/effects';
import { doGet, doPost, doPut, doDelete } from '../utils/request'
import { SEARCH_TYPE, DOCUMENTATION_TYPE, INTEGRATIONS } from '../utils/constants';
import { SEARCH_CARDS_REQUEST, SEARCH_TAGS_REQUEST, SEARCH_USERS_REQUEST, SEARCH_PERMISSION_GROUPS_REQUEST,  } from '../actions/actionTypes';
import { 
  handleSearchCardsSuccess, handleSearchCardsError,
  handleSearchTagsSuccess, handleSearchTagsError,
  handleSearchUsersSuccess, handleSearchUsersError,
  handleSearchPermissionGroupsSuccess, handleSearchPermissionGroupsError,
} from '../actions/search';

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

function* searchCards({ type, query, clearCards }) {
  try {
    const page = yield select(state => state.search.cards[type].page);
    const user = yield select(state => state.profile.user);

    let cards = [];
    if (!query.ids || query.ids.length !== 0) {
      cards = yield call(doGet, '/cards/query', { ...query, page });
    }

    const externalResults = [];
    if (type === SEARCH_TYPE.POPOUT && query.q !== '' && isLoggedIn(user, INTEGRATIONS.GOOGLE)) {
      const googleResults = yield call(doGet, '/google/drive/query', { q: query.q });
      externalResults.push({ source: DOCUMENTATION_TYPE.GOOGLE_DRIVE, results: googleResults });
    }

    yield put(handleSearchCardsSuccess(type, cards, externalResults, clearCards));
  } catch(error) {
    const { response: { data } } = error;
    yield put(handleSearchCardsError(type, data.error));
  }
}

function* searchTags({ name }) {
  try {
    const { tags } = yield call(doPost, '/tags/queryNames', { name });
    yield put(handleSearchTagsSuccess(tags));
  } catch(error) {
    const { response: { data } } = error;
    yield put(handleSearchTagsError(data.error));
  }
}

function* searchUsers({ name }) {
  try {
    const { users } = yield call(doPost, '/users/queryNames', { name });
    yield put(handleSearchUsersSuccess(users));
  } catch(error) {
    const { response: { data } } = error;
    yield put(handleSearchUsersError(data.error));
  }
}

function* searchPermissionGroups({ name }) {
  try {
    const { permissiongroups } = yield call(doPost, '/permissiongroups/queryNames', { name });
    yield put(handleSearchPermissionGroupsSuccess(permissiongroups));
  } catch(error) {
    const { response: { data } } = error;
    yield put(handleSearchPermissionGroupsError(data.error));
  }
}

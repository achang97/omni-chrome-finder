import _ from 'lodash';
import * as types from '../actions/actionTypes';

export const initialState = {
  user: {},
  userEdits: {},
  isEditingAbout: false,

  isChangingNotificationPermissions: false,
};

export default function displayReducer(state = initialState, action) {
  const { type, payload = {} } = action;

  switch (type) {
    case types.LOGIN_SUCCESS:
    case types.SYNC_AUTH_INFO: {
      const { user } = payload;
      return { ...state, user };
    }

    case types.GET_USER_REQUEST: {
      return { ...state, isGettingUser: true, getUserError: null };
    }
    case types.GET_USER_SUCCESS: {
      const { user } = payload;
      return { ...state, isGettingUser: false, user };
    }
    case types.GET_USER_ERROR: {
      const { error } = payload;
      return { ...state, isGettingUser: false, getUserError: error };
    }

    // Changes to User
    case types.EDIT_USER: {
      const { firstname, lastname, bio } = state.user;
      return { ...state, isEditingAbout: true, userEdits: { firstname, lastname, bio } };
    }
    case types.CHANGE_FIRSTNAME: {
      const { text } = payload;
      return { ...state, userEdits: { ...state.userEdits, firstname: text } };
    }
    case types.CHANGE_LASTNAME: {
      const { text } = payload;
      return { ...state, userEdits: { ...state.userEdits, lastname: text } };
    }
    case types.CHANGE_BIO: {
      const { text } = payload;
      return { ...state, userEdits: { ...state.userEdits, bio: text } };
    }

    case types.SAVE_USER_REQUEST: {
      return { ...state, isSavingUser: true, userSaveError: null };
    }
    case types.SAVE_USER_SUCCESS: {
      const { user } = payload;
      return { ...state, isSavingUser: false, user, userEdits: {}, isEditingAbout: false };
    }
    case types.SAVE_USER_ERROR: {
      const { error } = payload;
      return { ...state, isSavingUser: false, userSaveError: error };
    }

    case types.CHANGE_NOTIFICATION_PERMISSIONS_REQUEST: {
      const { permissions } = payload;
      return { ...state, isChangingNotificationPermissions: true, changeNotificationPermissionsError: null };
    }
    case types.CHANGE_NOTIFICATION_PERMISSIONS_SUCCESS: {
      const { user } = payload;
      return { ...state, user, isChangingNotificationPermissions: false };
    }
    case types.CHANGE_NOTIFICATION_PERMISSIONS_ERROR: {
      const { error } = payload;
      return { ...state, isChangingNotificationPermissions: false, changeNotificationPermissionsError: error };
    }


    case types.ADD_BOOKMARK_REQUEST:
    case types.REMOVE_BOOKMARK_ERROR: {
      const { cardId } = payload;
      return {
        ...state,
        user: { ...state.user, bookmarkIds: _.union(state.user.bookmarkIds, [cardId]) }
      };
    }
    case types.REMOVE_BOOKMARK_REQUEST:
    case types.ADD_BOOKMARK_ERROR: {
      const { cardId } = payload;
      return {
        ...state,
        user: { ...state.user, bookmarkIds: _.without(state.user.bookmarkIds, cardId) }
      };
    }

    default:
      return state;
  }
}

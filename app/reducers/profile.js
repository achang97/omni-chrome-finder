import _ from 'lodash';
import * as types from 'actions/actionTypes';
import { PROFILE, INTEGRATIONS } from 'appConstants';

export const initialState = {
  user: {},
  analytics: {
    count: 0,
    totalUpvotes: 0,
    upToDateCount: 0,
    outOfDateCount: 0
  },

  userEdits: {},
  isEditingAbout: false,

  permissionState: {
    [PROFILE.SETTING_SECTION_TYPE.AUTOFIND]: {},
    [PROFILE.SETTING_SECTION_TYPE.NOTIFICATIONS]: {}
  },

  integrationState: {
    [INTEGRATIONS.SLACK.type]: {},
    [INTEGRATIONS.ZENDESK.type]: {},
    [INTEGRATIONS.GOOGLE.type]: {},
    [INTEGRATIONS.GMAIL.type]: {}
  }
};

export default function displayReducer(state = initialState, action) {
  const { type, payload = {} } = action;

  const updateStateByType = (stateName, type, newInfo) => ({
    ...state,
    [stateName]: {
      ...state[stateName],
      [type]: {
        ...state[stateName][type],
        ...newInfo
      }
    }
  });

  switch (type) {
    case types.LOGIN_SUCCESS:
    case types.SYNC_AUTH_INFO: {
      const { user } = payload;
      return { ...state, user };
    }

    case types.VERIFY_SUCCESS: { 
      return { ...state, user: { ...state.user, isVerified: true } };
    }

    case types.GET_USER_REQUEST: {
      return { ...state, isGettingUser: true, getUserError: null };
    }
    case types.GET_USER_SUCCESS: {
      const { user, analytics } = payload;
      return { ...state, isGettingUser: false, user, analytics };
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

    case types.UPDATE_USER_PERMISSIONS_REQUEST: {
      const { type, permission } = payload;
      return updateStateByType('permissionState', type, { isLoading: true, error: null });
    }
    case types.UPDATE_USER_PERMISSIONS_SUCCESS: {
      const { type, user } = payload;
      return { ...updateStateByType('permissionState', type, { isLoading: false }), user };
    }
    case types.UPDATE_USER_PERMISSIONS_ERROR: {
      const { type, error } = payload;
      return updateStateByType('permissionState', type, { isLoading: false, error });
    }

    case types.LOGOUT_USER_INTEGRATION_REQUEST: {
      const { integration } = payload;
      return updateStateByType('integrationState', integration, { isLoading: true, error: null });
    }
    case types.LOGOUT_USER_INTEGRATION_SUCCESS: {
      const { integration, user } = payload;
      return { ...updateStateByType('integrationState', integration, { isLoading: false }), user };
    }
    case types.LOGOUT_USER_INTEGRATION_ERROR: {
      const { integration, error } = payload;
      return updateStateByType('integrationState', integration, { isLoading: false, error });
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

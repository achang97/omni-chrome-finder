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

  // Onboarding Stats
  badge: null,
  percentage: 0,
  performance: [],

  userEdits: {},
  isEditingAbout: false,

  permissionState: {
    [PROFILE.SETTING_SECTION_TYPE.AUTOFIND]: {},
    [PROFILE.SETTING_SECTION_TYPE.NOTIFICATIONS]: {},
    [PROFILE.SETTING_SECTION_TYPE.EXTERNAL_VERIFICATION]: {}
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

  const updateStateByType = (stateName, stateType, newInfo) => ({
    ...state,
    [stateName]: {
      ...state[stateName],
      [stateType]: {
        ...state[stateName][stateType],
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

    case types.GET_USER_ONBOARDING_STATS_REQUEST: {
      return { ...state, isGettingOnboardingStats: true, getOnboardingStatsError: null };
    }
    case types.GET_USER_ONBOARDING_STATS_SUCCESS: {
      const { badge, percentage, performance } = payload;
      return { ...state, isGettingOnboardingStats: false, badge, percentage, performance };
    }
    case types.GET_USER_ONBOARDING_STATS_ERROR: {
      const { error } = payload;
      return { ...state, isGettingOnboardingStats: false, getOnboardingStatsError: error };
    }

    // Changes to User
    case types.EDIT_USER: {
      const { firstname, lastname, bio = '' } = state.user;
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

    case types.UPDATE_USER_REQUEST: {
      return { ...state, isUpdatingUser: true, updateUserError: null };
    }
    case types.UPDATE_USER_SUCCESS: {
      const { user } = payload;
      return { ...state, isUpdatingUser: false, user };
    }
    case types.UPDATE_USER_ERROR: {
      const { error } = payload;
      return { ...state, isUpdatingUser: false, updateUserError: error };
    }

    case types.SAVE_USER_EDITS_REQUEST: {
      return { ...state, isSavingEdits: true, saveEditsError: null };
    }
    case types.SAVE_USER_EDITS_SUCCESS: {
      const { user } = payload;
      return { ...state, isSavingEdits: false, user, userEdits: {}, isEditingAbout: false };
    }
    case types.SAVE_USER_EDITS_ERROR: {
      const { error } = payload;
      return { ...state, isSavingEdits: false, saveEditsError: error };
    }

    case types.UPDATE_PROFILE_PICTURE_REQUEST:
    case types.DELETE_PROFILE_PICTURE_REQUEST: {
      return { ...state, isUpdatingPicture: true, pictureError: null };
    }
    case types.UPDATE_PROFILE_PICTURE_SUCCESS:
    case types.DELETE_PROFILE_PICTURE_SUCCESS: {
      const { user } = payload;
      return { ...state, isUpdatingPicture: false, user };
    }
    case types.UPDATE_PROFILE_PICTURE_ERROR:
    case types.DELETE_PROFILE_PICTURE_ERROR: {
      const { error } = payload;
      return { ...state, isUpdatingPicture: false, pictureError: error };
    }

    case types.UPDATE_USER_PERMISSIONS_REQUEST: {
      const { type: permissionType } = payload;
      return updateStateByType('permissionState', permissionType, { isLoading: true, error: null });
    }
    case types.UPDATE_USER_PERMISSIONS_SUCCESS: {
      const { type: permissionType, user } = payload;
      const newState = updateStateByType('permissionState', permissionType, { isLoading: false });
      return { ...newState, user };
    }
    case types.UPDATE_USER_PERMISSIONS_ERROR: {
      const { type: permissionType, error } = payload;
      return updateStateByType('permissionState', permissionType, { isLoading: false, error });
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

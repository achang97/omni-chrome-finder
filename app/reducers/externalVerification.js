import * as types from 'actions/actionTypes';
import _ from 'lodash';
import { DEFAULT_VERIFICATION_INTERVAL } from 'appConstants/card';

const initialState = {
  isDisplayed: true,
  activeIntegration: null,
  isFinderModalOpen: false,
  isCreateModalOpen: false,
  owners: [],
  verificationInterval: DEFAULT_VERIFICATION_INTERVAL,
  finderNode: null,
  externalCard: null
};

export default function externalVerificationReducer(state = initialState, action) {
  const { type, payload = {} } = action;

  switch (type) {
    case types.RESET_EXTERNAL_STATE: {
      return initialState;
    }
    case types.UPDATE_EXTERNAL_VERIFICATION_INTERVAL: {
      const { interval } = payload;
      return { ...state, verificationInterval: interval };
    }
    case types.ADD_EXTERNAL_OWNER: {
      const { owner } = payload;
      return { ...state, owners: _.unionBy(state.owners, [owner], '_id') };
    }
    case types.REMOVE_EXTERNAL_OWNER: {
      const { owner } = payload;
      return { ...state, owners: _.differencyBy(state.owners, [owner], '_id') };
    }

    case types.TOGGLE_EXTERNAL_FINDER_MODAL: {
      return { ...state, isFinderModalOpen: !state.isFinderModalOpen };
    }
    case types.UPDATE_EXTERNAL_FINDER_NODE: {
      const { finderNode } = payload;
      return { ...state, finderNode };
    }

    case types.TOGGLE_EXTERNAL_CREATE_MODAL: {
      return { ...state, isCreateModalOpen: !state.isCreateModalOpen };
    }
    case types.TOGGLE_EXTERNAL_DISPLAY: {
      return { ...state, isDisplayed: !state.isDisplayed };
    }
    case types.UPDATE_EXTERNAL_INTEGRATION: {
      const { integration } = payload;
      return { ...state, activeIntegration: integration };
    }

    case types.GET_EXTERNAL_CARD_REQUEST: {
      return { ...state, isGettingCard: true, getCardError: null };
    }
    case types.GET_EXTERNAL_CARD_SUCCESS: {
      const { card } = payload;
      return { ...state, isGettingCard: false, externalCard: card };
    }
    case types.GET_EXTERNAL_CARD_ERROR: {
      const { error } = payload;
      return { ...state, isGettingCard: false, getCardError: error };
    }

    case types.CREATE_EXTERNAL_CARD_REQUEST: {
      return { ...state, isCreatingCard: true, createCardError: null };
    }
    case types.CREATE_EXTERNAL_CARD_SUCCESS: {
      const { card } = payload;
      return { ...state, isCreatingCard: false, externalCard: card, isCreateModalOpen: false };
    }
    case types.CREATE_EXTERNAL_CARD_ERROR: {
      const { error } = payload;
      return { ...state, isCreatingCard: false, createCardError: error };
    }

    default:
      return state;
  }
}

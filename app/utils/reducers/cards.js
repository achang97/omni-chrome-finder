import _ from 'lodash';
import { CARD, FINDER, USER } from 'appConstants';
import { updateArrayOfObjects, updateIndex, removeIndex } from '../array';

export const BASE_MODAL_OPEN_STATE = _.mapValues(CARD.MODAL_TYPE, () => false);

export const BASE_CARD_STATE = {
  isEditing: false,
  sideDockOpen: false,
  modalOpen: BASE_MODAL_OPEN_STATE,
  edits: {},
  hasLoaded: true,
  outOfDateReasonInput: '',
  editAccessReasonInput: '',
  status: CARD.STATUS.NOT_DOCUMENTED,
  tags: [],
  verificationInterval: CARD.DEFAULT_VERIFICATION_INTERVAL,
  permissions: CARD.PERMISSION_OPTIONS[0],
  permissionGroups: [],
  upvotes: [],
  slackThreadIndex: 0,
  slackThreadConvoPairs: [],
  slackReplies: [],
  attachments: [],
  owners: [],
  subscribers: [],
  approvers: [],
  question: '',
  answerModel: '',
  inviteRole: USER.ROLE.VIEWER
};

/* Card Helpers */
export function createCardEdits(card) {
  const {
    owners,
    subscribers,
    approvers,
    attachments,
    tags,
    permissions,
    permissionGroups,
    verificationInterval,
    question,
    answerModel,
    finderNode,
    slackReplies,
    edits
  } = card;
  return {
    ...card,
    isEditing: true,
    edits: {
      owners,
      subscribers,
      approvers,
      attachments,
      tags,
      permissions,
      permissionGroups,
      verificationInterval,
      question,
      answerModel,
      finderNode,
      slackReplies,
      ...edits
    }
  };
}

/* State Update functions */
export function getIndexById(state, id) {
  return state.cards.findIndex((card) => card._id === id);
}

export function getCardById(state, id) {
  const { activeCard, cards } = state;
  if (id === activeCard._id) {
    return activeCard;
  }

  const index = getIndexById(state, id);
  if (index === -1) {
    return null;
  }
  return cards[index];
}

/* Edit Card helper functions */
export function updateActiveCard(state, newInfo, newEditsInfo = {}) {
  return {
    ...state,
    activeCard: {
      ...state.activeCard,
      edits: { ...state.activeCard.edits, ...newEditsInfo },
      ...newInfo
    }
  };
}

export function updateActiveCardEdits(state, newEditsInfo) {
  return updateActiveCard(state, {}, newEditsInfo);
}

export function updateCardById(state, id, newInfo, updateCardsArray = false) {
  if (!state.activeCard) {
    return state;
  }

  if (id === state.activeCard._id && !updateCardsArray) {
    return updateActiveCard(state, newInfo);
  }
  if (id === state.activeCard._id && updateCardsArray) {
    const newActiveCard = { ...state.activeCard, ...newInfo };
    return {
      ...state,
      activeCard: newActiveCard,
      cards: updateArrayOfObjects(state.cards, { _id: id }, newActiveCard, false)
    };
  }
  return {
    ...state,
    cards: updateArrayOfObjects(state.cards, { _id: id }, newInfo)
  };
}

export function getUpdatedCards(state) {
  const { activeCardIndex, cards, activeCard } = state;
  return updateIndex(cards, activeCardIndex, activeCard);
}

export function updateAttachmentsByKey(state, cardId, key, newInfo) {
  const currCard = getCardById(state, cardId);
  if (!currCard) {
    return state;
  }

  const newCardInfo = {
    edits: {
      ...currCard.edits,
      attachments: updateArrayOfObjects(currCard.edits.attachments, { key }, newInfo)
    }
  };

  return updateCardById(state, cardId, newCardInfo);
}

/* Card removal functions */
export function removeCardAtIndex(state, index) {
  const { activeCardIndex, cards, activeCard } = state;

  const newCards = removeIndex(cards, index);

  if (newCards.length === 0) {
    // Return to finder view
    return {
      ...state,
      cards: newCards,
      activeCardIndex: FINDER.TAB_INDEX,
      activeCard: FINDER.TAB
    };
  }

  const isClosingActiveCard = index === activeCardIndex;

  let newActiveCardIndex = activeCardIndex;
  if (newActiveCardIndex >= newCards.length) {
    newActiveCardIndex = newCards.length - 1;
  }

  const newActiveCard = isClosingActiveCard ? newCards[newActiveCardIndex] : activeCard;

  return {
    ...state,
    cards: newCards,
    activeCardIndex: newActiveCardIndex,
    activeCard: newActiveCard
  };
}

export function removeCardById(state, id) {
  const index = getIndexById(state, id);
  if (index !== -1) {
    return removeCardAtIndex(state, index);
  }
  return state;
}

/* General update functions */
export function setActiveCardIndex(state, index) {
  const { activeCardIndex, cards } = state;

  if (index === activeCardIndex) {
    return state;
  }

  const activeCard = index === FINDER.TAB_INDEX ? FINDER.TAB : cards[index];
  return { ...state, activeCardIndex: index, activeCard, cards: getUpdatedCards(state) };
}

export default {
  BASE_MODAL_OPEN_STATE,
  BASE_CARD_STATE,
  createCardEdits,
  getIndexById,
  getCardById,
  updateActiveCard,
  updateActiveCardEdits,
  updateCardById,
  getUpdatedCards,
  removeCardAtIndex,
  removeCardById,
  setActiveCardIndex,
  updateAttachmentsByKey
};

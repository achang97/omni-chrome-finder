import * as types from '../actions/actionTypes';
import _ from 'underscore';
import { EditorState } from 'draft-js';
import { removeIndex, updateIndex } from '../utils/arrayHelpers';
import { CARD_STATUS_OPTIONS, EDITOR_TYPE, CARD_DIMENSIONS, MODAL_TYPE } from '../utils/constants';

const PLACEHOLDER_MESSAGES = [
  {
    senderName: 'Chetan Rane',
    message: 'Savings her pleased are several started females met. Short her not among being any. Thing of judge fruit charm views do. Miles mr an forty along as he. She education get middleton day agreement performed preserved unwilling. Do however as pleased offence outward beloved by present. By outward neither he so covered amiable greater. Juvenile proposal betrayed he an informed weddings followed. Precaution day see imprudence sympathize principles. At full leaf give quit to in they up.',
    time: 'Today at 3:52 PM',
    selected: true,
  },
  {
    senderName: 'Andrew Chang',
    message: 'What up bro how u doin',
    time: 'Today at 3:52 PM',
    selected: true,
  },
  {
    senderName: 'Chetan Rane',
    message: 'Savings her pleased are several started females met. Short her not among being any. Thing of judge fruit charm views do. Miles mr an forty along as he. She education get middleton day agreement performed preserved unwilling. Do however as pleased offence outward beloved by present. By outward neither he so covered amiable greater. Juvenile proposal betrayed he an informed weddings followed. Precaution day see imprudence sympathize principles. At full leaf give quit to in they up.',
    time: 'Today at 3:52 PM',
    selected: true,
  },
];

const initialState = {
  cards: [],
  cardsWidth: CARD_DIMENSIONS.DEFAULT_CARDS_WIDTH,
  cardsHeight: CARD_DIMENSIONS.DEFAULT_CARDS_HEIGHT,
  activeCardIndex: -1,
  activeCard: {},
};

export default function cards(state = initialState, action) {
  const { type, payload = {} } = action;

  const updateActiveCard = (newInfo, newEditsInfo={}) => {
    return { ...state, activeCard: { ...state.activeCard, ...newInfo, edits: { ...state.activeCard.edits, ...newEditsInfo } } };
  }

  const updateActiveCardEdits = (newEditsInfo) => {
    return updateActiveCard({}, newEditsInfo);
  }

  const createActiveCardEdits = (card) => {
    const { owners, attachments, tags, keywords, permissions, verificationInterval, question, answerEditorState, descriptionEditorState, messages } = card;
    return {
      ...card,
      isEditing: true,
      edits: { owners, attachments, tags, keywords, permissions, verificationInterval, question, answerEditorState, descriptionEditorState, messages }
    };
  }

  const getUpdatedCards = () => {
    const { activeCardIndex, cards, activeCard } = state;
    return updateIndex(cards, activeCardIndex, activeCard);
  }

  switch (type) {
    case types.ADJUST_CARDS_DIMENSIONS: {
      const { newWidth, newHeight } = payload;
      return { ...state, cardsWidth: newWidth, cardsHeight: newHeight };
    }

    case types.OPEN_CARD: {
      const { card, isNewCard, createModalOpen } = payload;
      const { cards, activeCardIndex } = state;

      // Check if card is already open
      if (!isNewCard && cards.some(({ id: currId }) => currId === card.id)) {
        return state;
      }

      let cardInfo = {
        isEditing: false, 
        sideDockOpen: false, 
        modalOpen: { [MODAL_TYPE.CREATE]: false, [MODAL_TYPE.THREAD]: false },
        editorEnabled: { [EDITOR_TYPE.DESCRIPTION]: false, [EDITOR_TYPE.ANSWER]: false },
        descriptionSectionHeight: CARD_DIMENSIONS.MIN_QUESTION_HEIGHT,
        edits: {},
        ...card,
      };

      if (isNewCard) {
        cardInfo = createActiveCardEdits({
          ...cardInfo,
          id: `new-card-${Math.floor(Math.random() * 10001)}`,
          cardStatus: CARD_STATUS_OPTIONS.NOT_DOCUMENTED,
          modalOpen: { ...cardInfo.modalOpen, [MODAL_TYPE.CREATE]: createModalOpen },
          editorEnabled: { ...cardInfo.editorEnabled, [EDITOR_TYPE.ANSWER]: true },
          messages: PLACEHOLDER_MESSAGES, // [],
          owners: [],
          attachments: [],
          tags: [],
          keywords: [],
          verificationInterval: null,
          permissions: null,
        });
      } else {
        // Will have to update this section in the future
        cardInfo = {
          ...cardInfo,
          messages: PLACEHOLDER_MESSAGES,
        }
      }

      let newCards = activeCardIndex === -1 ? [] : getUpdatedCards();
      newCards = [...newCards, cardInfo];

      return { ...state, cards: newCards, activeCard: cardInfo, activeCardIndex: newCards.length - 1 };
    }
    case types.SET_ACTIVE_CARD_INDEX: {
      const { index } = payload;
      const { activeCard, activeCardIndex, cards } = state;

      if (index === activeCard) {
        return state;
      }

      return {...state, activeCardIndex: index, activeCard: cards[index], cards: getUpdatedCards() };
    }
    case types.CLOSE_CARD: {
      const { index } = payload;
      const { activeCardIndex, cards, activeCard } = state;

      const newCards = removeIndex(cards, index);

      if (newCards.length === 0) {
        return initialState;
      }

      const isClosingActiveCard = index === activeCardIndex;

      let newActiveCardIndex = activeCardIndex;
      if (newActiveCardIndex >= newCards.length) {
        newActiveCardIndex = newCards.length - 1;
      }

      const newActiveCard = isClosingActiveCard ? newCards[newActiveCardIndex] : activeCard;

      return { ...state, cards: newCards, activeCardIndex: newActiveCardIndex, activeCard: newActiveCard };
    }

    case types.OPEN_CARD_SIDE_DOCK: {
      return updateActiveCard({ sideDockOpen: true });
    }
    case types.CLOSE_CARD_SIDE_DOCK: {
      return updateActiveCard({ sideDockOpen: false });
    }

    case types.ENABLE_CARD_EDITOR: {
      const { editorType } = payload;
      const { activeCard } = state;
      return updateActiveCard({ editorEnabled: { ...activeCard.editorEnabled, [editorType]: true } });
    }
    case types.DISABLE_CARD_EDITOR: {
      const { editorType } = payload;
      const { activeCard } = state;
      return updateActiveCard({ editorEnabled: { ...activeCard.editorEnabled, [editorType]: false } });
    }

    case types.OPEN_CARD_MODAL: {
      const { modalType } = payload;
      const { activeCard } = state; 
      return updateActiveCard({ modalOpen: { ...activeCard.modalOpen, [modalType]: true } });
    }
    case types.CLOSE_CARD_MODAL: {
      const { modalType} = payload;
      const { activeCard } = state;
      const newInfo = { modalOpen: { ...activeCard.modalOpen, [modalType]: false } };
      return updateActiveCard(newInfo);
    }      
    case types.UPDATE_CARD_STATUS: {
      const { cardStatus } = payload;
      return updateActiveCard({ cardStatus });
    }

    case types.ADJUST_CARD_DESCRIPTION_SECTION_HEIGHT: {
      const { newHeight } = payload;
      return updateActiveCard({ descriptionSectionHeight: newHeight });
    }

    case types.UPDATE_CARD_QUESTION: {
      const { question } = payload;
      return updateActiveCardEdits({ question });
    }
    case types.UPDATE_CARD_ANSWER_EDITOR: {
      const { editorState } = payload;
      return updateActiveCardEdits({ answerEditorState: editorState });
    }
    case types.UPDATE_CARD_DESCRIPTION_EDITOR: {
      const { editorState } = payload;
      return updateActiveCardEdits({ descriptionEditorState: editorState });
    }

    case types.TOGGLE_CARD_SELECTED_MESSAGE: {
      const { messageIndex } = payload;
      const { activeCard } = state;
      
      const messages = activeCard.edits.messages;
      const newMessages = updateIndex(messages, messageIndex, { ...messages[messageIndex], selected: !messages[messageIndex].selected });
      return updateActiveCardEdits({ messages: newMessages });
    }
    case types.CANCEL_EDIT_CARD_MESSAGES: {
      const { activeCard } = state;
      return updateActiveCardEdits({ messages: activeCard.messages });
    }

    case types.ADD_CARD_ATTACHMENTS: {
      const { attachments } = payload;
      const { activeCard: { edits } } = state; 
      const newAttachments = attachments.map(attachment => ({ type: 'attachment', data: attachment }));
      return updateActiveCardEdits({ attachments: [...edits.attachments, ...newAttachments] });
    }
    case types.REMOVE_CARD_ATTACHMENT: {
      const { index } = payload;
      const { activeCard: { edits } } = state; 
      return updateActiveCardEdits({ attachments: removeIndex(edits.attachments, index) });
    }

    case types.ADD_CARD_OWNER: {
      const { owner } = payload;
      const { activeCard: { edits } } = state; 
      return updateActiveCardEdits({ owners: _.union(edits.owners, [owner]) });
    }
    case types.REMOVE_CARD_OWNER: {
      const { index } = payload;
      const { activeCard: { edits } } = state; 
      return updateActiveCardEdits({ owners: removeIndex(edits.owners, index) });
    }

    case types.ADD_CARD_TAG: {
      const { tag } = payload;
      const { activeCard: { edits } } = state; 
      return updateActiveCardEdits({ tags: _.union(edits.tags, [tag]) });
    }
    case types.REMOVE_CARD_TAG: {
      const { index } = payload;
      const { activeCard: { edits } } = state; 
      return updateActiveCardEdits({ tags: removeIndex(edits.tags, index) });
    }

    case types.UPDATE_CARD_KEYWORDS: {
      const { keywords } = payload;
      return updateActiveCardEdits({ keywords: keywords || [] });
    }
    case types.UPDATE_CARD_VERIFICATION_INTERVAL: {
      const { verificationInterval } = payload;
      return updateActiveCardEdits({ verificationInterval });
    }
    case types.UPDATE_CARD_PERMISSIONS: {
      const { permissions } = payload;
      return updateActiveCardEdits({ permissions });
    }

    case types.EDIT_CARD: {
      const { activeCard } = state;
      return { ...state, activeCard: createActiveCardEdits(activeCard) };
    }
    case types.CANCEL_EDIT_CARD: { 
      const { activeCard } = state;
      return updateActiveCard({ isEditing: false, edits: {} });
    }
    case types.SAVE_CARD: {
      // Edits will be made to this case when connecting to the backend.
      const { activeCard } = state;
      const newCardState = updateActiveCard({ isEditing: false, ...activeCard.edits });
      return { ...newCardState, cards: getUpdatedCards() };
    }

    case types.CLOSE_ALL_CARDS: {
      return initialState;
    }

    default:
      return state;
  }
}

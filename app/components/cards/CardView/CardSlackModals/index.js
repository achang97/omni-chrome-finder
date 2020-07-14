import { connect } from 'react-redux';
import {
  cancelEditCardMessages,
  updateCardSelectedThreadIndex,
  requestGetSlackThread,
  toggleCardSelectedMessage,
  closeCardModal
} from 'actions/cards';
import CardSlackModals from './CardSlackModals';

const mapStateToProps = (state) => {
  const {
    cards: {
      activeCard: {
        isEditing,
        slackReplies,
        edits,
        slackThreadConvoPairs,
        slackThreadIndex,
        isGettingSlackThread,
        getSlackThreadError,
        modalOpen
      }
    }
  } = state;

  return {
    isEditing,
    slackReplies,
    edits,
    slackThreadConvoPairs,
    slackThreadIndex,
    isGettingSlackThread,
    getSlackThreadError,
    modalOpen
  };
};

const mapDispatchToProps = {
  cancelEditCardMessages,
  updateCardSelectedThreadIndex,
  requestGetSlackThread,
  toggleCardSelectedMessage,
  closeCardModal
};

export default connect(mapStateToProps, mapDispatchToProps)(CardSlackModals);

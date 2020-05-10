import { connect } from 'react-redux';
import {
  updateOutOfDateReason,
  updateCardSelectedThreadIndex,
  toggleCardSelectedMessage,
  closeCardModal,
  closeCard,
  cancelEditCard,
  cancelEditCardMessages,
  requestDeleteCard,
  requestUpdateCard,
  requestMarkUpToDate,
  requestMarkOutOfDate,
  requestApproveCard,
  requestGetSlackThread
} from 'actions/cards';
import CardConfirmModals from './CardConfirmModals';

const mapStateToProps = (state) => {
  const {
    cards: {
      activeCard: {
        isEditing,
        slackReplies,
        edits,
        modalOpen,
        slackThreadConvoPairs,
        slackThreadIndex,
        deleteError,
        isDeletingCard,
        updateError,
        isUpdatingCard,
        isMarkingStatus,
        markStatusError,
        isGettingSlackThread,
        getSlackThreadError,
        outOfDateReasonInput
      },
      activeCardIndex
    }
  } = state;

  return {
    isEditing,
    slackReplies,
    edits,
    modalOpen,
    slackThreadConvoPairs,
    slackThreadIndex,
    deleteError,
    isDeletingCard,
    updateError,
    isUpdatingCard,
    isMarkingStatus,
    markStatusError,
    isGettingSlackThread,
    getSlackThreadError,
    outOfDateReasonInput,
    activeCardIndex
  };
};

const mapDispatchToProps = {
  updateOutOfDateReason,
  updateCardSelectedThreadIndex,
  toggleCardSelectedMessage,
  closeCardModal,
  closeCard,
  cancelEditCard,
  cancelEditCardMessages,
  requestDeleteCard,
  requestUpdateCard,
  requestMarkUpToDate,
  requestMarkOutOfDate,
  requestApproveCard,
  requestGetSlackThread
};

export default connect(mapStateToProps, mapDispatchToProps)(CardConfirmModals);

import { connect } from 'react-redux';
import {
  updateOutOfDateReason,
  updateCardSelectedThreadIndex,
  toggleCardSelectedMessage,
  updateInviteRole,
  updateInviteEmail,
  closeCardModal,
  closeCard,
  cancelEditCard,
  cancelEditCardMessages,
  requestDeleteCard,
  requestUpdateCard,
  requestMarkUpToDate,
  requestMarkOutOfDate,
  requestApproveCard,
  requestGetSlackThread,
  requestCreateInvite
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
        outOfDateReasonInput,
        inviteEmail,
        inviteRole,
        isCreatingInvite,
        createInviteError
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
    inviteEmail,
    inviteRole,
    isCreatingInvite,
    createInviteError,
    activeCardIndex
  };
};

const mapDispatchToProps = {
  updateOutOfDateReason,
  updateCardSelectedThreadIndex,
  toggleCardSelectedMessage,
  updateInviteRole,
  updateInviteEmail,
  closeCardModal,
  closeCard,
  cancelEditCard,
  cancelEditCardMessages,
  requestDeleteCard,
  requestUpdateCard,
  requestMarkUpToDate,
  requestMarkOutOfDate,
  requestApproveCard,
  requestGetSlackThread,
  requestCreateInvite
};

export default connect(mapStateToProps, mapDispatchToProps)(CardConfirmModals);

import { connect } from 'react-redux';
import {
  updateOutOfDateReason,
  updateInviteRole,
  updateInviteEmail,
  closeCardModal,
  closeCard,
  cancelEditCard,
  requestDeleteCard,
  requestUpdateCard,
  requestMarkUpToDate,
  requestMarkOutOfDate,
  requestArchiveCard,
  requestCreateInvite
} from 'actions/cards';
import CardConfirmModals from './CardConfirmModals';

const mapStateToProps = (state) => {
  const {
    cards: {
      activeCard: {
        modalOpen,
        deleteError,
        isDeletingCard,
        updateError,
        isUpdatingCard,
        isMarkingStatus,
        markStatusError,
        isArchivingCard,
        archiveError,
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
    modalOpen,
    deleteError,
    isDeletingCard,
    updateError,
    isUpdatingCard,
    isMarkingStatus,
    markStatusError,
    isArchivingCard,
    archiveError,
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
  updateInviteRole,
  updateInviteEmail,
  closeCardModal,
  closeCard,
  cancelEditCard,
  requestDeleteCard,
  requestUpdateCard,
  requestMarkUpToDate,
  requestMarkOutOfDate,
  requestArchiveCard,
  requestCreateInvite
};

export default connect(mapStateToProps, mapDispatchToProps)(CardConfirmModals);

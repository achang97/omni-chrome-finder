import { connect } from 'react-redux';
import {
  updateOutOfDateReason,
  updateEditAccessReason,
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
  requestCreateInvite,
  requestGetEditAccess
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
        editAccessReasonInput,
        isRequestingEditAccess,
        editAccessError,
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
    editAccessReasonInput,
    editAccessError,
    isRequestingEditAccess,
    inviteEmail,
    inviteRole,
    isCreatingInvite,
    createInviteError,
    activeCardIndex
  };
};

const mapDispatchToProps = {
  updateOutOfDateReason,
  updateEditAccessReason,
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
  requestCreateInvite,
  requestGetEditAccess
};

export default connect(mapStateToProps, mapDispatchToProps)(CardConfirmModals);

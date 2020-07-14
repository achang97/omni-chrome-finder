import React from 'react';
import PropTypes from 'prop-types';

import { ConfirmModal, Select } from 'components/common';
import { MODAL_TYPE } from 'appConstants/card';
import { ROLE } from 'appConstants/user';

import { createSelectOptions, createSelectOption } from 'utils/select';
import { getStyleApplicationFn } from 'utils/style';

const s = getStyleApplicationFn();

const CardConfirmModals = ({
  activeCardIndex,
  inviteEmail,
  inviteRole,
  isCreatingInvite,
  createInviteError,
  modalOpen,
  deleteError,
  isDeletingCard,
  updateError,
  isUpdatingCard,
  outOfDateReasonInput,
  isMarkingStatus,
  markStatusError,
  isArchivingCard,
  archiveError,
  closeCardModal,
  closeCard,
  cancelEditCard,
  updateOutOfDateReason,
  updateInviteRole,
  updateInviteEmail,
  requestUpdateCard,
  requestDeleteCard,
  requestMarkUpToDate,
  requestMarkOutOfDate,
  requestArchiveCard,
  requestCreateInvite
}) => {
  const confirmCloseModalUndocumentedPrimary = () => {
    closeCardModal(MODAL_TYPE.CONFIRM_CLOSE);
    closeCard(activeCardIndex);
  };

  const confirmCloseEditModalSecondary = () => {
    closeCardModal(MODAL_TYPE.CONFIRM_CLOSE_EDIT);
    cancelEditCard();
  };

  const MODALS = [
    {
      modalType: MODAL_TYPE.INVITE_USER,
      title: 'Invite User',
      shouldCloseOnOutsideClick: true,
      body: (
        <div className={s('flex items-center')}>
          <input
            value={inviteEmail}
            placeholder="Enter invite email"
            onChange={(e) => updateInviteEmail(e.target.value)}
            className={s('flex-1 mr-xs')}
            autoFocus
          />
          <Select
            value={createSelectOption(inviteRole)}
            placeholder="Select invite role"
            options={createSelectOptions(Object.values(ROLE))}
            onChange={({ value }) => updateInviteRole(value)}
            className={s('flex-1 ml-xs')}
          />
        </div>
      ),
      error: createInviteError,
      secondaryButtonProps: {
        text: 'Cancel'
      },
      primaryButtonProps: {
        text: 'Invite User',
        onClick: requestCreateInvite,
        isLoading: isCreatingInvite,
        disabled: !inviteEmail
      },
      important: true
    },
    {
      modalType: MODAL_TYPE.CONFIRM_CLOSE,
      title: 'Save Changes',
      description:
        'You have unsaved changes on this card. Would you like to save your changes before closing?',
      primaryButtonProps: {
        text: 'Save',
        onClick: () => requestUpdateCard(true),
        isLoading: isUpdatingCard
      },
      secondaryButtonProps: {
        onClick: () => closeCard(activeCardIndex)
      },
      zIndex: 200
    },
    {
      modalType: MODAL_TYPE.CONFIRM_CLOSE_UNDOCUMENTED,
      title: 'Close Card',
      description:
        'You have not yet documented this card. All changes will be lost upon closing. Are you sure you want to close this card?',
      primaryButtonProps: {
        text: 'Close Card',
        onClick: confirmCloseModalUndocumentedPrimary
      },
      important: true
    },
    {
      modalType: MODAL_TYPE.CONFIRM_OUT_OF_DATE,
      title: 'Are you sure this card needs to be updated?',
      body: (
        <div>
          <div className={s('text-xs text-gray-light mb-xs')}> Reason for Update </div>
          <textarea
            type="textarea"
            className={s('w-full')}
            placeholder="Please explain why this card is out of date."
            value={outOfDateReasonInput}
            onChange={(e) => updateOutOfDateReason(e.target.value)}
          />
        </div>
      ),
      error: markStatusError,
      primaryButtonProps: {
        text: 'Confirm and send to owner',
        onClick: requestMarkOutOfDate,
        isLoading: isMarkingStatus
      }
    },
    {
      modalType: MODAL_TYPE.CONFIRM_UP_TO_DATE,
      title: 'Confirm Up-to-Date',
      description: 'Are you sure this card is now Up to Date?',
      error: markStatusError,
      primaryButtonProps: {
        onClick: requestMarkUpToDate,
        isLoading: isMarkingStatus
      }
    },
    {
      modalType: MODAL_TYPE.CONFIRM_UP_TO_DATE_SAVE,
      title: 'Card Update',
      description:
        'This card was originally not labeled as up to date. Would you like to mark it as Up to Date?',
      primaryButtonProps: {
        onClick: requestMarkUpToDate,
        isLoading: isMarkingStatus
      }
    },
    {
      modalType: MODAL_TYPE.CONFIRM_APPROVE,
      title: 'Confirm Approval',
      description: 'Would you like to approve the changes to this card?',
      primaryButtonProps: {
        onClick: requestMarkUpToDate,
        isLoading: isMarkingStatus
      }
    },
    {
      modalType: MODAL_TYPE.ERROR_UPDATE,
      title: 'Update Error',
      description: `${updateError} Please try again.`,
      primaryButtonProps: {
        text: 'Ok',
        onClick: () => closeCardModal(MODAL_TYPE.ERROR_UPDATE)
      },
      showSecondary: false
    },
    {
      modalType: MODAL_TYPE.ERROR_UPDATE_CLOSE,
      title: 'Update Error',
      description: `${updateError} Would you still like to close the card?`,
      primaryButtonProps: {
        onClick: () => closeCard(activeCardIndex)
      }
    },
    {
      modalType: MODAL_TYPE.ERROR_DELETE,
      title: 'Deletion Error',
      description: `${deleteError} Please try again.`,
      primaryButtonProps: {
        text: 'Ok',
        onClick: () => closeCardModal(MODAL_TYPE.ERROR_DELETE)
      },
      showSecondary: false
    },
    {
      modalType: MODAL_TYPE.CONFIRM_DELETE,
      title: 'Confirm Deletion',
      description:
        'Deletion is permanent. All information will be lost upon closing. Are you sure you want to delete this card?',
      primaryButtonProps: {
        text: 'Delete',
        onClick: requestDeleteCard,
        isLoading: isDeletingCard
      }
    },
    {
      modalType: MODAL_TYPE.CONFIRM_ARCHIVE,
      title: 'Confirm Archive',
      description: 'Are you sure you want to archive this card?',
      primaryButtonProps: {
        text: 'Archive',
        onClick: requestArchiveCard,
        isLoading: isArchivingCard
      }
    },
    {
      modalType: MODAL_TYPE.ERROR_ARCHIVE,
      title: 'Archive Error',
      description: `${archiveError} Please try again.`,
      primaryButtonProps: {
        text: 'Ok',
        onClick: () => closeCardModal(MODAL_TYPE.ERROR_ARCHIVE)
      },
      showSecondary: false
    },
    {
      modalType: MODAL_TYPE.CONFIRM_CLOSE_EDIT,
      title: 'Confirm Go Back',
      description: 'You have unsaved changes on this card. Would you like to save them?',
      primaryButtonProps: {
        text: 'Save',
        onClick: () => requestUpdateCard(false),
        isLoading: isUpdatingCard
      },
      secondaryButtonProps: {
        onClick: confirmCloseEditModalSecondary
      },
      important: true
    }
  ];

  return (
    <>
      {MODALS.map(({ modalType, canClose = true, ...rest }) => (
        <ConfirmModal
          key={modalType}
          isOpen={modalOpen[modalType]}
          onRequestClose={canClose ? () => closeCardModal(modalType) : null}
          {...rest}
        />
      ))}
    </>
  );
};

CardConfirmModals.propTypes = {
  // Redux State
  activeCardIndex: PropTypes.number.isRequired,
  modalOpen: PropTypes.objectOf(PropTypes.bool).isRequired,
  inviteEmail: PropTypes.string,
  inviteRole: PropTypes.oneOf(Object.values(ROLE)),
  isCreatingInvite: PropTypes.bool,
  createInviteError: PropTypes.string,
  deleteError: PropTypes.string,
  isDeletingCard: PropTypes.bool,
  updateError: PropTypes.string,
  isUpdatingCard: PropTypes.bool,
  isMarkingStatus: PropTypes.bool,
  markStatusError: PropTypes.string,
  isArchivingCard: PropTypes.bool,
  archiveError: PropTypes.string,
  outOfDateReasonInput: PropTypes.string.isRequired,

  // Redux Actions
  updateOutOfDateReason: PropTypes.func.isRequired,
  closeCardModal: PropTypes.func.isRequired,
  closeCard: PropTypes.func.isRequired,
  cancelEditCard: PropTypes.func.isRequired,
  requestDeleteCard: PropTypes.func.isRequired,
  requestUpdateCard: PropTypes.func.isRequired,
  requestMarkUpToDate: PropTypes.func.isRequired,
  requestMarkOutOfDate: PropTypes.func.isRequired,
  requestArchiveCard: PropTypes.func.isRequired,
  updateInviteRole: PropTypes.func.isRequired,
  updateInviteEmail: PropTypes.func.isRequired,
  requestCreateInvite: PropTypes.func.isRequired
};

export default CardConfirmModals;

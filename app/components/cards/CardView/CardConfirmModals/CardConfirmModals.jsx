import React from 'react';
import PropTypes from 'prop-types';
import { MdOpenInNew } from 'react-icons/md';

import { CheckBox, ConfirmModal, Select } from 'components/common';
import { MODAL_TYPE } from 'appConstants/card';
import { USER_ROLE } from 'appConstants/profile';

import { createSelectOptions, createSelectOption } from 'utils/select';
import { getStyleApplicationFn } from 'utils/style';
import style from './card-confirm-modals.css';

const s = getStyleApplicationFn(style);

const CardConfirmModals = ({
  activeCardIndex,
  isEditing,
  slackReplies,
  edits,
  inviteEmail,
  inviteRole,
  isCreatingInvite,
  createInviteError,
  modalOpen,
  slackThreadConvoPairs,
  slackThreadIndex,
  deleteError,
  isDeletingCard,
  updateError,
  isUpdatingCard,
  isGettingSlackThread,
  getSlackThreadError,
  outOfDateReasonInput,
  isMarkingStatus,
  markStatusError,
  isArchivingCard,
  archiveError,
  closeCardModal,
  closeCard,
  cancelEditCard,
  cancelEditCardMessages,
  updateCardSelectedThreadIndex,
  updateOutOfDateReason,
  toggleCardSelectedMessage,
  updateInviteRole,
  updateInviteEmail,
  requestUpdateCard,
  requestDeleteCard,
  requestMarkUpToDate,
  requestMarkOutOfDate,
  requestArchiveCard,
  requestGetSlackThread,
  requestCreateInvite
}) => {
  const closeThreadModal = () => {
    closeCardModal(MODAL_TYPE.THREAD);
    cancelEditCardMessages();
  };

  const toggleSelectedMessage = (i) => {
    toggleCardSelectedMessage(i);
  };

  const renderModalThreadBody = () => {
    const currSlackReplies = isEditing ? edits.slackReplies : slackReplies;
    return (
      <div className={s('message-manager-container')}>
        {currSlackReplies.length === 0 && (
          <div className={s('text-center p-lg')}>No Slack replies to display</div>
        )}
        {currSlackReplies.map(
          ({ id, senderName, senderImageUrl, message, selected, link }, i) =>
            (isEditing || selected) && (
              <div
                key={id}
                className={s(`
                  p-reg relative
                  ${isEditing ? 'cursor-pointer' : ''}
                  ${i % 2 === 0 ? '' : 'bg-purple-gray-10'}
                `)}
                onClick={isEditing ? () => toggleSelectedMessage(i) : null}
              >
                {link && (
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={s('absolute top-0 right-0')}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div
                      className={s(
                        'bg-purple-gray-10 rounded-tr-lg rounded-bl-lg p-xs text-purple-reg text-sm'
                      )}
                    >
                      <MdOpenInNew />
                    </div>
                  </a>
                )}
                <div className={s('flex')}>
                  <img
                    src={senderImageUrl}
                    className={s(
                      'message-photo-container rounded-lg flex-shrink-0 flex justify-center mr-reg shadow-md'
                    )}
                    alt={senderName}
                  />
                  <div className={s('flex flex-col flex-grow')}>
                    <div className={s('flex items-end')}>
                      <div className={s('text-sm font-semibold mr-reg')}> {senderName} </div>
                    </div>
                    <div className={s('mt-sm text-sm')}>{message}</div>
                  </div>
                  {isEditing && (
                    <CheckBox isSelected={!!selected} className={s('flex-shrink-0 m-sm')} />
                  )}
                </div>
              </div>
            )
        )}
      </div>
    );
  };

  const renderSelectThreadBody = () => {
    return (
      <div className={s('message-manager-container')}>
        {slackThreadConvoPairs.map(({ _id, channelId, channelName }, i) => {
          const isSelected = i === slackThreadIndex;
          return (
            <div
              key={_id}
              className={s(`
                flex p-reg items-center justify-between cursor-pointer
                ${i % 2 === 0 ? '' : 'bg-purple-gray-10'}
              `)}
              onClick={() => updateCardSelectedThreadIndex(i)}
            >
              <div
                className={s(
                  `${isSelected ? 'font-semibold' : 'text-gray-light font-medium'} text-md`
                )}
              >
                {channelId.charAt(0) === 'D' ? '@' : '#'}
                {channelName}
              </div>
              <CheckBox isSelected={isSelected} className={s('flex-shrink-0 m-sm')} />
            </div>
          );
        })}
      </div>
    );
  };

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
      modalType: MODAL_TYPE.THREAD,
      title: isEditing ? 'Unselect messages you do not want shown' : 'View Slack Thread',
      shouldCloseOnOutsideClick: true,
      onRequestClose: closeThreadModal,
      showPrimary: isEditing,
      showSecondary: false,
      bodyClassName: s('p-0 overflow-auto'),
      body: renderModalThreadBody(),
      primaryButtonProps: {
        text: 'Save',
        onClick: () => closeCardModal(MODAL_TYPE.THREAD),
        className: s('rounded-t-none flex-1')
      }
    },
    {
      modalType: MODAL_TYPE.SELECT_THREAD,
      title: 'Select thread for reference',
      shouldCloseOnOutsideClick: false,
      canClose: false,
      showSecondary: false,
      bodyClassName: s('p-0'),
      body: renderSelectThreadBody(),
      error: getSlackThreadError,
      primaryButtonProps: {
        text: 'Select',
        onClick: requestGetSlackThread,
        className: s('rounded-t-none flex-1'),
        isLoading: isGettingSlackThread
      }
    },
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
            options={createSelectOptions(Object.values(USER_ROLE))}
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
      }
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
      important: true
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

const SlackRepliesPropTypes = PropTypes.arrayOf(
  PropTypes.shape({
    id: PropTypes.string.isRequired,
    senderName: PropTypes.string.isRequired,
    senderImageUrl: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    selected: PropTypes.bool
  })
);

CardConfirmModals.propTypes = {
  // Redux State
  activeCardIndex: PropTypes.number.isRequired,
  isEditing: PropTypes.bool.isRequired,
  slackReplies: SlackRepliesPropTypes.isRequired,
  edits: PropTypes.shape({
    slackReplies: SlackRepliesPropTypes
  }).isRequired,
  modalOpen: PropTypes.objectOf(PropTypes.bool).isRequired,
  inviteEmail: PropTypes.string,
  inviteRole: PropTypes.oneOf(Object.values(USER_ROLE)),
  isCreatingInvite: PropTypes.bool,
  createInviteError: PropTypes.string,
  slackThreadConvoPairs: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      channelId: PropTypes.string.isRequired,
      channelName: PropTypes.string.isRequired
    })
  ).isRequired,
  slackThreadIndex: PropTypes.number.isRequired,
  deleteError: PropTypes.string,
  isDeletingCard: PropTypes.bool,
  updateError: PropTypes.string,
  isUpdatingCard: PropTypes.bool,
  isMarkingStatus: PropTypes.bool,
  markStatusError: PropTypes.string,
  isArchivingCard: PropTypes.bool,
  archiveError: PropTypes.string,
  isGettingSlackThread: PropTypes.bool,
  getSlackThreadError: PropTypes.string,
  outOfDateReasonInput: PropTypes.string.isRequired,

  // Redux Actions
  requestGetSlackThread: PropTypes.func.isRequired,
  updateOutOfDateReason: PropTypes.func.isRequired,
  updateCardSelectedThreadIndex: PropTypes.func.isRequired,
  toggleCardSelectedMessage: PropTypes.func.isRequired,
  closeCardModal: PropTypes.func.isRequired,
  closeCard: PropTypes.func.isRequired,
  cancelEditCard: PropTypes.func.isRequired,
  cancelEditCardMessages: PropTypes.func.isRequired,
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

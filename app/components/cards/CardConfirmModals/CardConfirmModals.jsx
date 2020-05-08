import React from 'react';

import { CheckBox, Loader } from 'components/common';
import { MODAL_TYPE, STATUS } from 'appConstants/card';

import { getStyleApplicationFn } from 'utils/style';
import style from './card-confirm-modals.css';
import CardConfirmModal from '../CardConfirmModal';

const s = getStyleApplicationFn(style);

const CardConfirmModals = ({
  activeCardIndex,
  isEditing,
  slackReplies,
  edits,
  modalOpen,
  slackThreadConvoPairs = [],
  updateCardSelectedThreadIndex,
  slackThreadIndex,
  openCardModal,
  closeCardModal,
  closeCard,
  cancelEditCard,
  cancelEditCardMessages,
  updateCardStatus,
  requestDeleteCard,
  deleteError,
  isDeletingCard,
  requestUpdateCard,
  updateError,
  isUpdatingCard,
  requestMarkUpToDate,
  requestMarkOutOfDate,
  requestApproveCard,
  isMarkingStatus,
  markStatusError,
  requestGetSlackThread,
  isGettingSlackThread,
  getSlackThreadError,
  outOfDateReasonInput,
  updateOutOfDateReason,
  toggleCardSelectedMessage
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
          ({ id, senderName, senderImageUrl, message, selected }, i) =>
            (isEditing || selected) && (
              <div
                key={id}
                className={s(`flex p-reg   ${i % 2 === 0 ? '' : 'bg-purple-gray-10'} `)}
              >
                <img
                  src={senderImageUrl}
                  className={s(
                    'message-photo-container rounded-lg flex-shrink-0 flex justify-center mr-reg shadow-md'
                  )}
                />
                <div className={s('flex flex-col flex-grow')}>
                  <div className={s('flex items-end')}>
                    <div className={s('text-sm font-semibold mr-reg')}> {senderName} </div>
                    {/* <div className={s("text-sm text-gray-dark")}> { time } </div> */}
                  </div>
                  <div className={s('mt-sm text-sm')}>{message}</div>
                </div>
                {isEditing && (
                  <CheckBox
                    isSelected={selected}
                    toggleCheckbox={() => toggleSelectedMessage(i)}
                    className={s('flex-shrink-0 margin-sm')}
                  />
                )}
              </div>
            )
        )}
      </div>
    );
  };

  const renderSelectThreadBody = () => {
    return (
      <div className={s('message-manager-container')}>
        {slackThreadConvoPairs.map(({ _id, threadId, channelId, channelName }, i) => {
          const isSelected = i === slackThreadIndex;
          return (
            <div
              key={_id}
              className={s(
                `flex p-reg items-center justify-between ${i % 2 === 0 ? '' : 'bg-purple-gray-10'} `
              )}
            >
              <div
                className={s(
                  `${isSelected ? 'font-semibold' : 'text-gray-light font-medium'} text-md`
                )}
              >
                {channelId.charAt(0) === 'U' ? '@' : '#'}
                {channelName}
              </div>
              <CheckBox
                isSelected={isSelected}
                toggleCheckbox={() => updateCardSelectedThreadIndex(i)}
                className={s('flex-shrink-0 margin-sm')}
              />
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
      bodyClassName: s('p-0'),
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
        text: 'No',
        onClick: () => closeCard(activeCardIndex)
      }
    },
    {
      modalType: MODAL_TYPE.CONFIRM_CLOSE_UNDOCUMENTED,
      title: 'Close Card',
      description:
        'You have not yet documented this card. All changes will be lost upon closing. Are you sure you want to close this card?',
      primaryButtonProps: {
        text: 'Close Card',
        onClick: confirmCloseModalUndocumentedPrimary
      }
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
        text: 'Yes',
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
        text: 'Yes',
        onClick: requestMarkUpToDate,
        isLoading: isMarkingStatus
      }
    },
    {
      modalType: MODAL_TYPE.CONFIRM_APPROVE,
      title: 'Confirm Approval',
      description: 'Would you like to approve the changes to this card?',
      primaryButtonProps: {
        text: 'Yes',
        onClick: requestApproveCard,
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
        text: 'Yes',
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
        onClick: () => requestDeleteCard(activeCardIndex),
        isLoading: isDeletingCard
      }
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
        text: 'No',
        onClick: confirmCloseEditModalSecondary
      }
    }
  ];

  return (
    <>
      {MODALS.map(({ modalType, canClose = true, ...rest }) => (
        <CardConfirmModal
          key={modalType}
          isOpen={modalOpen[modalType]}
          onRequestClose={canClose ? () => closeCardModal(modalType) : null}
          {...rest}
        />
      ))}
    </>
  );
};

export default CardConfirmModals;

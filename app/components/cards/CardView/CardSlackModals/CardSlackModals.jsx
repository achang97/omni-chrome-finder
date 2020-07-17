import React from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import { MdOpenInNew } from 'react-icons/md';

import { MODAL_TYPE } from 'appConstants/card';
import { CheckBox, ConfirmModal } from 'components/common';
import { getStyleApplicationFn } from 'utils/style';

import style from './card-slack-modals.css';

const s = getStyleApplicationFn(style);

const CardSlackModals = ({
  isEditing,
  modalOpen,
  slackReplies,
  edits,
  slackThreadConvoPairs,
  slackThreadIndex,
  isGettingSlackThread,
  getSlackThreadError,
  cancelEditCardMessages,
  updateCardSelectedThreadIndex,
  requestGetSlackThread,
  toggleCardSelectedMessage,
  closeCardModal
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
                    <div className={s('mt-sm text-sm')}>
                      <ReactMarkdown source={message} />
                    </div>
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

  const render = () => {
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

  return render();
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

CardSlackModals.propTypes = {
  // Redux State
  isEditing: PropTypes.bool.isRequired,
  slackReplies: SlackRepliesPropTypes.isRequired,
  edits: PropTypes.shape({
    slackReplies: SlackRepliesPropTypes
  }).isRequired,
  slackThreadConvoPairs: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      channelId: PropTypes.string.isRequired,
      channelName: PropTypes.string.isRequired
    })
  ).isRequired,
  slackThreadIndex: PropTypes.number.isRequired,
  isGettingSlackThread: PropTypes.bool,
  getSlackThreadError: PropTypes.string,

  // Redux Actions
  cancelEditCardMessages: PropTypes.func.isRequired,
  updateCardSelectedThreadIndex: PropTypes.func.isRequired,
  requestGetSlackThread: PropTypes.func.isRequired,
  toggleCardSelectedMessage: PropTypes.func.isRequired,
  closeCardModal: PropTypes.func.isRequired
};

export default CardSlackModals;

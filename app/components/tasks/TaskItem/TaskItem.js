import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import AnimateHeight from 'react-animate-height';
import { IoMdAlert } from 'react-icons/io';
import { MdKeyboardArrowDown, MdKeyboardArrowUp, MdCheck, MdAdd, MdEdit, MdLock, MdCheckCircle } from 'react-icons/md';
import { AiFillMinusCircle, AiFillQuestionCircle } from 'react-icons/ai';

import { Button, PlaceholderImg, Timeago, Loader, Message } from 'components/common';
import { TASKS, NOOP } from 'appConstants';

import SlackIcon from 'assets/images/icons/Slack_Mark.svg';

import style from './task-item.css';
import { getStyleApplicationFn } from 'utils/style';

const s = getStyleApplicationFn(style);

const TaskItem = ({
  id, createdAt, type, card, resolved, notifier, isLoading, error, onHide, className,
  ownUserId, requestMarkUpToDateFromTasks, requestDismissTask, requestApproveCardFromTasks, openCard,
  ...rest
}) => {

  const getHeaderInfo = () => {
    const notifierName = notifier.id === ownUserId ? 'You' : notifier.name;
    switch (type) {
      case TASKS.TYPE.NEEDS_VERIFICATION:
        return { headerTitle: 'Omni needs you to verify this card', headerTitleClassName: '', headerIcon: <IoMdAlert className={s('tasks-icon-container text-yellow-reg mr-reg')} /> };
      case TASKS.TYPE.OUT_OF_DATE:
        return { headerTitle: `${notifierName} flagged your card as out of date`, headerTitleClassName: 'text-red-reg', headerIcon: <AiFillMinusCircle className={s('tasks-icon-container text-red-reg mr-reg')} /> };
      case TASKS.TYPE.NOT_DOCUMENTED:
        return { headerTitle: 'Document your question', headerTitleClassName: 'text-purple-reg', headerIcon: <AiFillQuestionCircle className={s('tasks-icon-container text-purple-reg mr-reg')} /> };
      case TASKS.TYPE.NEEDS_APPROVAL:
        return { headerTitle: `${notifierName} needs you to approve this card`, headerTitleClassName: '', headerIcon: <MdCheckCircle className={s('tasks-icon-container text-purple-reg mr-reg')} /> };
      default:
        return null;
    }
  }

  const getButtonProps = () => {
    switch (type) {
      case TASKS.TYPE.NEEDS_VERIFICATION:
        return { buttonColor: 'secondary', buttonClassName: 'text-green-reg', buttonUnderline: false, buttonIcon: <MdCheck className={s('ml-sm')} /> };
      case TASKS.TYPE.OUT_OF_DATE:
        return { buttonColor: 'secondary', buttonClassName: '', buttonUnderline: false, buttonIcon: <MdEdit className={s('ml-sm')} /> };
      case TASKS.TYPE.NOT_DOCUMENTED:
        return { buttonColor: 'secondary', buttonClassName: '', buttonUnderline: false, buttonIcon: <MdAdd className={s('ml-sm')} /> };
      case TASKS.TYPE.NEEDS_APPROVAL:
        return { buttonColor: 'transparent', buttonClassName: '', buttonUnderline: false, buttonIcon: <MdCheck className={s('ml-sm')} /> };
      default:
        return '';
    }
  }

  const getContainerClass = () => {
    switch (type) {
      case TASKS.TYPE.NEEDS_VERIFICATION:
        return 'tasks-verification-gradient';
      case TASKS.TYPE.OUT_OF_DATE:
        return 'tasks-out-of-date-gradient';
      case TASKS.TYPE.NOT_DOCUMENTED:
        return 'tasks-undocumented-gradient';
      case TASKS.TYPE.NEEDS_APPROVAL:
        return 'tasks-undocumented-gradient';
      default:
        return '';
    }
  }

  const getTaskActionsInfo = () => {
    const { _id: cardId } = card;
    switch (type) {
      case TASKS.TYPE.NEEDS_VERIFICATION:
        return {
          primaryOption: 'Mark as Up to Date',
          secondaryOption: 'Edit',
          primaryAction: () => requestMarkUpToDateFromTasks(id, cardId),
          secondaryAction: () => openCard({ _id: cardId, isEditing: true }),
        };
      case TASKS.TYPE.OUT_OF_DATE:
        return {
          primaryOption: 'Edit',
          secondaryOption: 'Mark as Up to Date',
          primaryAction: () => openCard({ _id: cardId, isEditing: true }),
          secondaryAction: () => requestMarkUpToDateFromTasks(id, cardId),
        };
      case TASKS.TYPE.NOT_DOCUMENTED:
        return {
          primaryOption: 'Create Card',
          secondaryOption: 'Dismiss',
          primaryAction: () => openCard({ _id: cardId, isEditing: true }),
          secondaryAction: () => requestDismissTask(id),
        };
      case TASKS.TYPE.NEEDS_APPROVAL:
        return {
          primaryOption: 'Approve',
          primaryAction: () => requestApproveCardFromTasks(id, cardId),
          secondaryOption: 'Dismiss',
          secondaryAction: () => requestDismissTask(id),
        };
      default:
        return {};
    }
  }

  const renderTaskPreview = () => {
    const { answer, outOfDateReason, owners } = card;
    switch (type) {
      case TASKS.TYPE.NEEDS_VERIFICATION:
        return (<div className={s('text-xs text-gray-dark mt-reg vertical-ellipsis-2 break-words line-clamp-4')}>{answer}</div>);
      case TASKS.TYPE.OUT_OF_DATE:
        return (
          <div className={s('flex mt-reg items-center')}>
            <PlaceholderImg
              name={`${outOfDateReason.sender.firstname} ${outOfDateReason.sender.lastname}`}
              src={outOfDateReason.sender.profilePicture}
              className={s('task-item-profile-picture rounded-full text-xs mr-sm')}
            />
            <div className={s('bg-gray-xlight p-reg rounded-lg w-full vertical-ellipsis-2 text-xs break-words line-clamp-4')}>
              {outOfDateReason.reason === '' ? 'No reason specified.' : outOfDateReason.reason}
            </div>
          </div>
        );
      case TASKS.TYPE.NOT_DOCUMENTED:
        return (<div className={s('text-xs text-gray-dark mt-reg flex items-center')}>
          <div className={s('flex-grow')}>Question asked through Slack</div>
          <img src={SlackIcon} className={s('task-item-slack-icon rounded-full flex-shrink-0')} />
        </div>);
      case TASKS.TYPE.NEEDS_APPROVAL:
        return (
          <div className={s('flex mt-reg')}>
            <div className={s('flex flex-shrink-0 mr-reg')}>
              {/* Show the first owner of the card */}
              <div className={s('flex-shrink-0')}>
                <PlaceholderImg
                  name={`${owners[0].firstname} ${owners[0].lastname}`}
                  src={owners[0].profilePicture}
                  className={s('task-item-profile-picture rounded-full text-xs')}
                />
              </div>
            </div>
            <div className={s('card-tag overflow-hidden')}>
              <div className={s('truncate')}>Onboarding</div>
              <MdLock className={s('ml-reg flex-shrink-0')} />
            </div>
          </div>);
      default:
        return '';
    }
  }

  const renderUnresolvedTaskBody = () => {
    const { _id: cardId, question } = card;
    const { buttonColor, buttonClassName, buttonUnderline, buttonIcon } = getButtonProps();
    const { headerTitle, headerIcon, headerTitleClassName } = getHeaderInfo();
    const { primaryOption, primaryAction, secondaryOption, secondaryAction} = getTaskActionsInfo();

    return (isLoading ?
      <Loader className={s('')} /> :
      <>
        <div className={s('flex items-center')}>
          {headerIcon}
          <div className={s(`text-xs text-gray-reg font-semibold ${headerTitleClassName}`)}> {headerTitle} </div>
        </div>

        <div className={s('p-lg bg-white shadow-md my-lg rounded-lg shadow-md cursor-pointer')} onClick={() => openCard({ _id: cardId })}>
          <div className={s('font-semibold vertical-ellipsis-2 text-md line-clamp-2')}>{question}</div>
          { renderTaskPreview() }
        </div>

        {error && <div className={s('text-xs text-red-reg')}> {error} </div>}

        <div className={s('flex items-center justify-center')}>
          <div className={s('flex-grow text-gray-reg text-xs')}>
            <Timeago date={createdAt} live={false} />
          </div>
          <div className={s('flex items-center justify-center text-sm text-gray-reg')}>
            { secondaryOption && secondaryAction &&
              <div
                className={s('text-xs border-b border-t-0 border-r-0 border-l-0 border-solid border-gray-xlight cursor-pointer')}
                onClick={() => secondaryAction()}
              >
                {secondaryOption}
              </div>
            }
            <Button
              text={primaryOption}
              color={buttonColor}
              className={s(`ml-reg p-reg ${buttonClassName}`)}
              textClassName={s('text-xs font-semibold')}
              underline={buttonUnderline}
              icon={buttonIcon}
              iconLeft={false}
              onClick={() => primaryAction()}
            />
          </div>
        </div>
      </>
    );
  }

  const renderItem = children => {
    const containerClassName = getContainerClass();
    return (
      <div className={s(`flex flex-col p-lg rounded-lg ${containerClassName} ${className}`)} {...rest}>
        {children}
      </div>
    );
  };

  return (resolved ?
    <Message
      show={!!resolved}
      animate
      temporary
      message={renderItem(
        <div className={s('text-sm text-center')}>
          🎉 <span className={s('mx-sm')}> You've resolved this task! </span> 🎉
        </div>
      )}
      onHide={onHide}
    /> :
    renderItem(renderUnresolvedTaskBody())
  );
}

TaskItem.propTypes = {
  id: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  type: PropTypes.oneOf([TASKS.TYPE.NEEDS_VERIFICATION, TASKS.TYPE.OUT_OF_DATE, TASKS.TYPE.NOT_DOCUMENTED, TASKS.TYPE.NEEDS_APPROVAL]).isRequired,
  card: PropTypes.object.isRequired,
  resolved: PropTypes.bool.isRequired,
  notifier: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string.isRequired,
  }).isRequired,
  isLoading: PropTypes.bool,
  error: PropTypes.string,
  onHide: PropTypes.func,
  className: PropTypes.string,
};

TaskItem.defaultProps = {
  className: '',
  onHide: NOOP,
  isLoading: false,
};

export default TaskItem;
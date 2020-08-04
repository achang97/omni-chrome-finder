import React from 'react';
import PropTypes from 'prop-types';
import { IoMdAlert, IoMdUnlock } from 'react-icons/io';
import { MdCheck, MdAdd, MdEdit, MdCheckCircle, MdLock } from 'react-icons/md';
import { AiFillMinusCircle, AiFillQuestionCircle } from 'react-icons/ai';

import { Button, PlaceholderImg, Timeago, Loader, Message } from 'components/common';
import { TASKS } from 'appConstants';
import { UserPropTypes } from 'utils/propTypes';

import SlackIcon from 'assets/images/icons/Slack_Mark.svg';

import { getStyleApplicationFn } from 'utils/style';
import style from './task-item.css';

const s = getStyleApplicationFn(style);

const TaskItem = ({
  id,
  createdAt,
  type,
  card,
  data,
  resolved,
  notifier,
  isLoading,
  error,
  onHide,
  className,
  ownUserId,
  requestMarkUpToDateFromTasks,
  requestDismissTask,
  requestApproveEditAccessFromTasks,
  requestRejectEditAccessFromTasks,
  openCard
}) => {
  const getNotifierName = () => {
    if (!notifier) {
      return 'Omni';
    }
    if (notifier._id === ownUserId) {
      return 'You';
    }
    return `${notifier.firstname} ${notifier.lastname}`;
  };

  const getHeaderInfo = () => {
    const notifierName = getNotifierName();
    switch (type) {
      case TASKS.TYPE.NEEDS_VERIFICATION:
        return {
          headerTitle: 'Omni needs you to verify this card',
          headerTitleClassName: '',
          HeaderIcon: IoMdAlert,
          headerIconClassName: 'text-yellow-reg'
        };
      case TASKS.TYPE.OUT_OF_DATE:
        return {
          headerTitle: `${notifierName} flagged your card as out of date`,
          headerTitleClassName: 'text-red-reg',
          HeaderIcon: AiFillMinusCircle,
          headerIconClassName: 'text-red-reg'
        };
      case TASKS.TYPE.NOT_DOCUMENTED:
        return {
          headerTitle: 'Document your question',
          headerTitleClassName: 'text-purple-reg',
          HeaderIcon: AiFillQuestionCircle,
          headerIconClassName: 'text-purple-reg'
        };
      case TASKS.TYPE.NEEDS_APPROVAL:
        return {
          headerTitle: `${notifierName} needs you to approve this card`,
          headerTitleClassName: '',
          HeaderIcon: MdCheckCircle,
          headerIconClassName: 'text-purple-reg'
        };
      case TASKS.TYPE.REQUEST_EDIT_ACCESS:
        return {
          headerTitle: `${notifierName} wants to edit this card`,
          headerTitleClassName: '',
          HeaderIcon: MdLock,
          headerIconClassName: 'text-purple-reg'
        };
      default:
        return null;
    }
  };

  const getButtonProps = () => {
    switch (type) {
      case TASKS.TYPE.NEEDS_VERIFICATION:
        return {
          buttonClassName: 'text-green-reg',
          ButtonIcon: MdCheck
        };
      case TASKS.TYPE.OUT_OF_DATE:
        return {
          buttonClassName: '',
          ButtonIcon: MdEdit
        };
      case TASKS.TYPE.NOT_DOCUMENTED:
        return {
          buttonClassName: '',
          ButtonIcon: MdAdd
        };
      case TASKS.TYPE.NEEDS_APPROVAL:
        return {
          buttonClassName: 'text-green-reg',
          ButtonIcon: MdCheck
        };
      case TASKS.TYPE.REQUEST_EDIT_ACCESS:
        return {
          buttonClassName: 'text-green-reg',
          ButtonIcon: IoMdUnlock
        };
      default:
        return '';
    }
  };

  const getContainerClass = () => {
    switch (type) {
      case TASKS.TYPE.NEEDS_VERIFICATION:
        return 'tasks-verification-gradient';
      case TASKS.TYPE.OUT_OF_DATE:
        return 'tasks-out-of-date-gradient';
      case TASKS.TYPE.NOT_DOCUMENTED:
        return 'tasks-undocumented-gradient';
      case TASKS.TYPE.NEEDS_APPROVAL:
      case TASKS.TYPE.REQUEST_EDIT_ACCESS:
        return 'bg-purple-light';
      default:
        return '';
    }
  };

  const getTaskActionsInfo = () => {
    const { _id: cardId } = card;
    const { _id: notifierId } = notifier || {};

    switch (type) {
      case TASKS.TYPE.NEEDS_VERIFICATION:
        return {
          primaryOption: 'Mark as Up to Date',
          secondaryOption: 'Edit',
          primaryAction: () => requestMarkUpToDateFromTasks(id, cardId),
          secondaryAction: () => openCard({ _id: cardId, isEditing: true })
        };
      case TASKS.TYPE.OUT_OF_DATE:
        return {
          primaryOption: 'Edit',
          secondaryOption: 'Mark as Up to Date',
          primaryAction: () => openCard({ _id: cardId, isEditing: true }),
          secondaryAction: () => requestMarkUpToDateFromTasks(id, cardId)
        };
      case TASKS.TYPE.NOT_DOCUMENTED:
        return {
          primaryOption: 'Create Card',
          secondaryOption: 'Dismiss',
          primaryAction: () => openCard({ _id: cardId, isEditing: true }),
          secondaryAction: () => requestDismissTask(id)
        };
      case TASKS.TYPE.NEEDS_APPROVAL:
        return {
          primaryOption: 'Approve',
          primaryAction: () => requestMarkUpToDateFromTasks(id, cardId),
          secondaryOption: 'Dismiss',
          secondaryAction: () => requestDismissTask(id)
        };
      case TASKS.TYPE.REQUEST_EDIT_ACCESS:
        return {
          primaryOption: 'Grant Access',
          primaryAction: () => requestApproveEditAccessFromTasks(id, cardId, notifier),
          secondaryOption: 'Deny',
          secondaryAction: () => requestRejectEditAccessFromTasks(id, cardId, notifierId)
        };
      default:
        return {};
    }
  };

  const renderReasonPreview = (sender, reason) => {
    return (
      <div className={s('flex mt-reg items-center')}>
        {sender && (
          <PlaceholderImg
            name={`${sender.firstname} ${sender.lastname}`}
            src={sender.profilePicture}
            className={s('task-item-profile-picture')}
          />
        )}
        <div
          className={s(
            'bg-gray-xlight p-reg rounded-lg w-full vertical-ellipsis-2 text-xs break-words line-clamp-4'
          )}
        >
          {reason || 'No reason specified.'}
        </div>
      </div>
    );
  };

  const renderTaskPreview = () => {
    const { answer, externalLinkAnswer, outOfDateReason } = card;

    switch (type) {
      case TASKS.TYPE.NEEDS_APPROVAL:
      case TASKS.TYPE.NEEDS_VERIFICATION:
        return (
          <div
            className={s(
              'text-xs text-gray-dark mt-reg vertical-ellipsis-2 break-words line-clamp-4'
            )}
          >
            {externalLinkAnswer ? externalLinkAnswer.link : answer}
          </div>
        );
      case TASKS.TYPE.OUT_OF_DATE:
        return renderReasonPreview(outOfDateReason.sender, outOfDateReason.reason);
      case TASKS.TYPE.NOT_DOCUMENTED:
        return (
          <div className={s('text-xs text-gray-dark mt-reg flex items-center')}>
            <div className={s('flex-grow')}>Question asked through Slack</div>
            <img
              src={SlackIcon}
              className={s('task-item-slack-icon rounded-full flex-shrink-0')}
              alt="Slack"
            />
          </div>
        );
      case TASKS.TYPE.REQUEST_EDIT_ACCESS: {
        const { reason } = data;
        return renderReasonPreview(notifier, reason);
      }
      default:
        return null;
    }
  };

  const renderUnresolvedTaskBody = () => {
    const { _id: cardId, question } = card;
    const { buttonClassName, ButtonIcon } = getButtonProps();
    const { headerTitle, HeaderIcon, headerTitleClassName, headerIconClassName } = getHeaderInfo();
    const { primaryOption, primaryAction, secondaryOption, secondaryAction } = getTaskActionsInfo();

    return isLoading ? (
      <Loader />
    ) : (
      <>
        <div className={s('flex items-center')}>
          <HeaderIcon className={s(`tasks-icon-container mr-reg ${headerIconClassName}`)} />
          <div className={s(`text-xs text-gray-reg font-semibold ${headerTitleClassName}`)}>
            {headerTitle}
          </div>
        </div>

        <div
          className={s('p-lg bg-white shadow-md my-lg rounded-lg shadow-md cursor-pointer')}
          onClick={() => openCard({ _id: cardId })}
        >
          <div className={s('font-semibold vertical-ellipsis-2 text-md line-clamp-2')}>
            {question}
          </div>
          {renderTaskPreview()}
        </div>

        {error && <div className={s('text-xs text-red-reg')}> {error} </div>}

        <div className={s('flex items-center justify-center')}>
          <div className={s('flex-grow text-gray-reg text-xs')}>
            <Timeago date={createdAt} live={false} />
          </div>
          <div className={s('flex items-center justify-center text-sm text-gray-reg')}>
            {secondaryOption && secondaryAction && (
              <div
                className={s(
                  'text-xs border-b border-t-0 border-r-0 border-l-0 border-solid border-gray-xlight cursor-pointer'
                )}
                onClick={() => secondaryAction()}
              >
                {secondaryOption}
              </div>
            )}
            <Button
              text={primaryOption}
              color="secondary"
              className={s(`ml-reg p-reg ${buttonClassName}`)}
              textClassName={s('text-xs font-semibold')}
              underline={false}
              icon={<ButtonIcon className={s('ml-sm')} />}
              iconLeft={false}
              onClick={() => primaryAction()}
            />
          </div>
        </div>
      </>
    );
  };

  const renderItem = (children) => {
    const containerClassName = getContainerClass();
    return (
      <div className={s(`flex flex-col p-lg rounded-lg ${containerClassName} ${className}`)}>
        {children}
      </div>
    );
  };

  return resolved ? (
    <Message
      show={!!resolved}
      animate
      temporary
      message={renderItem(
        <div className={s('text-sm text-center')}>
          <span role="img" aria-label="Party">
            🎉
          </span>
          <span className={s('mx-sm')}> You&apos;ve resolved this task! </span>
          <span role="img" aria-label="Party">
            🎉
          </span>
        </div>
      )}
      onHide={onHide}
    />
  ) : (
    renderItem(renderUnresolvedTaskBody())
  );
};

TaskItem.propTypes = {
  id: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  type: PropTypes.oneOf([
    TASKS.TYPE.NEEDS_VERIFICATION,
    TASKS.TYPE.OUT_OF_DATE,
    TASKS.TYPE.NOT_DOCUMENTED,
    TASKS.TYPE.NEEDS_APPROVAL,
    TASKS.TYPE.REQUEST_EDIT_ACCESS
  ]).isRequired,
  card: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    question: PropTypes.string.isRequired,
    answer: PropTypes.string,
    externalLinkAnswer: PropTypes.shape({
      link: PropTypes.string.isRequired
    }),
    tags: PropTypes.array,
    outOfDateReason: PropTypes.object
  }).isRequired,
  data: PropTypes.shape({
    reason: PropTypes.string
  }),
  resolved: PropTypes.bool.isRequired,
  notifier: UserPropTypes,
  isLoading: PropTypes.bool,
  error: PropTypes.string,
  onHide: PropTypes.func,
  className: PropTypes.string,

  // Redux State
  ownUserId: PropTypes.string.isRequired,

  // Redux Actions
  requestMarkUpToDateFromTasks: PropTypes.func.isRequired,
  requestDismissTask: PropTypes.func.isRequired,
  requestApproveEditAccessFromTasks: PropTypes.func.isRequired,
  requestRejectEditAccessFromTasks: PropTypes.func.isRequired,
  openCard: PropTypes.func.isRequired
};

TaskItem.defaultProps = {
  notifier: null,
  error: null,
  isLoading: false,
  className: ''
};

export default TaskItem;

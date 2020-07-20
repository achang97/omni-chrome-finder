import React from 'react';
import PropTypes from 'prop-types';
import { MdModeEdit, MdThumbUp, MdBookmark, MdNotifications } from 'react-icons/md';

import { Message, Button, Loader, Tooltip } from 'components/common';
import { toggleUpvotes } from 'utils/card';
import { getStyleApplicationFn } from 'utils/style';
import { isAnyLoading } from 'utils/file';
import { UserPropTypes } from 'utils/propTypes';

import { STATUS, MODAL_TYPE } from 'appConstants/card';
import style from './card-footer.css';

const s = getStyleApplicationFn(style);

const CardFooter = ({
  toastMessage,
  onToastHide,
  user,
  canEdit,
  hasValidEdits,
  activeScreenRecordingId,
  _id,
  status,
  upvotes,
  subscribers,
  owners,
  requestedEditAccess,
  edits,
  isUpdatingBookmark,
  isUpdatingCard,
  isEditing,
  isTogglingUpvote,
  isTogglingSubscribe,
  hasCardChanged,
  requestToggleUpvote,
  requestToggleSubscribe,
  requestAddBookmark,
  requestRemoveBookmark,
  requestUpdateCard,
  editCard,
  openCardModal,
  cancelEditCard
}) => {
  const renderEditView = () => {
    const isRecording = activeScreenRecordingId === _id;

    if (status === STATUS.NOT_DOCUMENTED) {
      return (
        <Button
          text="Add to Knowledge Base"
          color="primary"
          onClick={() => openCardModal(MODAL_TYPE.CREATE)}
          className={s('rounded-t-none p-lg')}
          disabled={
            edits.question === '' ||
            !edits.answerModel ||
            isAnyLoading(edits.attachments) ||
            isRecording
          }
          underline
        />
      );
    }

    return (
      <Button
        text="Save Updates"
        color="primary"
        onClick={hasCardChanged ? () => requestUpdateCard(false) : cancelEditCard}
        iconLeft={false}
        icon={isUpdatingCard ? <Loader className={s('ml-sm')} size="sm" color="white" /> : null}
        className={s('rounded-t-none p-lg')}
        disabled={!hasValidEdits || isUpdatingCard || isRecording}
        underline
      />
    );
  };

  const renderReadView = () => {
    let editButtonProps;
    if (canEdit) {
      editButtonProps = {
        text: 'Edit Card',
        onClick: editCard
      };
    } else if (requestedEditAccess) {
      editButtonProps = {
        text: 'Pending Edit Access Request',
        color: null,
        className: s('bg-yellow-100 text-yellow-600')
      };
    } else {
      editButtonProps = {
        text: 'Request Edit Access',
        onClick: () => openCardModal(MODAL_TYPE.EDIT_ACCESS_REQUEST)
      };
    }

    const hasUpvoted = upvotes.some((upvoteId) => upvoteId === user._id);
    const hasBookmarked = user.bookmarkIds.some((bookmarkId) => bookmarkId === _id);
    const hasSubscribed = subscribers.some(({ _id: userId }) => userId === user._id);

    const isOwner = owners.some(({ _id: userId }) => userId === user._id);

    const actionButtons = [
      {
        key: 'helpful',
        tooltip: hasUpvoted ? 'Unmark as Helpful' : 'Mark Helpful',
        text: upvotes.length !== 0 ? `(${upvotes.length})` : '',
        icon: <MdThumbUp className={s(upvotes.length ? 'mr-xs' : '')} />,
        isSelected: hasUpvoted,
        disabled: isTogglingUpvote,
        onClick: () => requestToggleUpvote(toggleUpvotes(upvotes, user._id))
      },
      {
        key: 'bookmark',
        tooltip: hasBookmarked ? 'Remove Bookmark' : 'Add Bookmark',
        icon: <MdBookmark />,
        isSelected: hasBookmarked,
        disabled: isUpdatingBookmark,
        onClick: () => {
          const bookmarkOnClick = hasBookmarked ? requestRemoveBookmark : requestAddBookmark;
          bookmarkOnClick(_id);
        }
      },
      {
        key: 'subscribe',
        tooltip: (() => {
          if (!hasSubscribed) {
            return 'Subscribe';
          }
          return isOwner
            ? 'You are an owner and cannot unsubscribe from this card.'
            : 'Unsubscribe';
        })(),
        icon: <MdNotifications />,
        isSelected: hasSubscribed,
        disabled: isTogglingSubscribe || isOwner,
        onClick: requestToggleSubscribe
      }
    ];

    return (
      <div className={s('flex items-center justify-between rounded-b-lg px-lg py-sm')}>
        <Button
          color="primary"
          icon={<MdModeEdit className={s('mr-sm')} />}
          className={s('mr-sm')}
          {...editButtonProps}
        />
        <div className={s('flex')}>
          {actionButtons.map(({ key, isSelected, tooltip, ...restButtonProps }, i) => (
            <Tooltip key={key} tooltip={tooltip} tooltipProps={{ place: 'left' }}>
              <Button
                key={key}
                className={s(i !== actionButtons.length - 1 ? 'mr-sm' : '')}
                color={isSelected ? 'gold' : 'secondary'}
                {...restButtonProps}
              />
            </Tooltip>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={s('flex-shrink-0 min-h-0 relative')}>
      {
        // Avoid using show prop due to absolute positioning
        !isEditing && !!toastMessage && (
          <Message
            className={s('card-footer-toast')}
            message={toastMessage}
            temporary
            onHide={() => onToastHide()}
          />
        )
      }
      {isEditing ? renderEditView() : renderReadView()}
    </div>
  );
};

CardFooter.displayName = 'CardFooter';

CardFooter.propTypes = {
  toastMessage: PropTypes.string,
  onToastHide: PropTypes.func.isRequired,

  // Redux State
  user: UserPropTypes.isRequired,
  canEdit: PropTypes.bool.isRequired,
  hasValidEdits: PropTypes.bool.isRequired,
  activeScreenRecordingId: PropTypes.string,
  _id: PropTypes.string.isRequired,
  status: PropTypes.oneOf(Object.values(STATUS)).isRequired,
  upvotes: PropTypes.arrayOf(PropTypes.string).isRequired,
  subscribers: PropTypes.arrayOf(PropTypes.object).isRequired,
  owners: PropTypes.arrayOf(PropTypes.object).isRequired,
  requestedEditAccess: PropTypes.bool,
  edits: PropTypes.shape({
    question: PropTypes.string,
    answerModel: PropTypes.string,
    attachments: PropTypes.arrayOf(PropTypes.object)
  }).isRequired,
  isUpdatingBookmark: PropTypes.bool,
  isUpdatingCard: PropTypes.bool,
  isTogglingUpvote: PropTypes.bool,
  isTogglingSubscribe: PropTypes.bool,
  isEditing: PropTypes.bool.isRequired,
  hasCardChanged: PropTypes.bool.isRequired,

  // Redux Actions
  requestToggleUpvote: PropTypes.func.isRequired,
  requestToggleSubscribe: PropTypes.func.isRequired,
  requestAddBookmark: PropTypes.func.isRequired,
  requestRemoveBookmark: PropTypes.func.isRequired,
  openCardModal: PropTypes.func.isRequired,
  requestUpdateCard: PropTypes.func.isRequired,
  editCard: PropTypes.func.isRequired,
  cancelEditCard: PropTypes.func.isRequired
};

CardFooter.defaultProps = {
  toastMessage: null
};

export default CardFooter;

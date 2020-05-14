import React from 'react';
import PropTypes from 'prop-types';
import { MdModeEdit, MdThumbUp, MdBookmarkBorder } from 'react-icons/md';
import { EditorState } from 'draft-js';

import { Message, Button, Loader, Tooltip } from 'components/common';
import { hasValidEdits, toggleUpvotes } from 'utils/card';
import { getStyleApplicationFn } from 'utils/style';
import { isAnyLoading } from 'utils/file';
import { UserPropTypes } from 'utils/propTypes';

import { STATUS, MODAL_TYPE } from 'appConstants/card';
import style from './card-footer.css';

const s = getStyleApplicationFn(style);

const CardFooter = React.forwardRef(
  (
    {
      toastMessage,
      onToastHide,
      user,
      activeScreenRecordingId,
      _id,
      status,
      upvotes,
      edits,
      isUpdatingBookmark,
      isUpdatingCard,
      isEditing,
      isTogglingUpvote,
      hasCardChanged,
      requestToggleUpvote,
      requestAddBookmark,
      requestRemoveBookmark,
      requestUpdateCard,
      editCard,
      openCardModal,
      cancelEditCard
    },
    ref
  ) => {
    const hasUpvoted = upvotes.some((upvoteId) => upvoteId === user._id);
    const hasBookmarked = user.bookmarkIds.some((bookmarkId) => bookmarkId === _id);
    const bookmarkOnClick = hasBookmarked ? requestRemoveBookmark : requestAddBookmark;
    const isRecording = activeScreenRecordingId === _id;

    const renderEditView = () => {
      if (status === STATUS.NOT_DOCUMENTED) {
        return (
          <Button
            text="Add to Knowledge Base"
            color="primary"
            onClick={() => openCardModal(MODAL_TYPE.CREATE)}
            className={s('rounded-t-none p-lg')}
            disabled={
              edits.question === '' ||
              !edits.answerEditorState.getCurrentContent().hasText() ||
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
          onClick={() => (hasCardChanged ? requestUpdateCard() : cancelEditCard())}
          iconLeft={false}
          icon={isUpdatingCard ? <Loader className={s('ml-sm')} size="sm" color="white" /> : null}
          className={s('rounded-t-none p-lg')}
          disabled={!hasValidEdits(edits) || isUpdatingCard || isRecording}
          underline
        />
      );
    };

    const renderReadView = () => (
      <div className={s('flex items-center justify-between rounded-b-lg px-lg py-sm')}>
        <div className={s('flex')}>
          <Button
            text="Edit Card"
            color="primary"
            icon={<MdModeEdit className={s('mr-sm')} />}
            onClick={editCard}
            className={s('mr-sm')}
          />
        </div>
        <div className={s('flex')}>
          <Button
            text={`Helpful${upvotes.length !== 0 ? ` (${upvotes.length})` : ''}`}
            icon={<MdThumbUp className={s('mr-sm')} />}
            className={s('mr-reg')}
            color={hasUpvoted ? 'gold' : 'secondary'}
            disabled={isTogglingUpvote}
            onClick={() => requestToggleUpvote(toggleUpvotes(upvotes, user._id))}
          />
          <Tooltip
            tooltip={hasBookmarked ? 'Remove Bookmark' : 'Add Bookmark'}
            tooltipProps={{ place: 'left' }}
          >
            <Button
              icon={<MdBookmarkBorder />}
              color={hasBookmarked ? 'gold' : 'secondary'}
              disabled={isUpdatingBookmark}
              onClick={() => bookmarkOnClick(_id)}
            />
          </Tooltip>
        </div>
      </div>
    );

    return (
      <div className={s('flex-shrink-0 min-h-0 relative')} ref={ref}>
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
  }
);

CardFooter.displayName = 'CardFooter';

CardFooter.propTypes = {
  toastMessage: PropTypes.string,
  onToastHide: PropTypes.func.isRequired,

  // Redux State
  user: UserPropTypes.isRequired,
  activeScreenRecordingId: PropTypes.string,
  _id: PropTypes.string.isRequired,
  status: PropTypes.oneOf(Object.values(STATUS)).isRequired,
  upvotes: PropTypes.arrayOf(PropTypes.string).isRequired,
  edits: PropTypes.shape({
    question: PropTypes.string,
    answerEditorState: PropTypes.instanceOf(EditorState),
    attachments: PropTypes.arrayOf(PropTypes.object)
  }).isRequired,
  isUpdatingBookmark: PropTypes.bool,
  isUpdatingCard: PropTypes.bool,
  isTogglingUpvote: PropTypes.bool,
  isEditing: PropTypes.bool.isRequired,
  hasCardChanged: PropTypes.bool.isRequired,

  // Redux Actions
  requestToggleUpvote: PropTypes.func.isRequired,
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

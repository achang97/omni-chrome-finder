import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {
  MdCheck,
  MdMoreHoriz,
  MdModeEdit,
  MdThumbUp,
  MdBookmarkBorder,
  MdError,
  MdAttachment,
  MdKeyboardArrowLeft,
  MdLock,
  MdContentCopy
} from 'react-icons/md';
import { IoIosShareAlt } from 'react-icons/io';
import { FaSlack } from 'react-icons/fa';
import { Resizable } from 're-resizable';

import TextEditor from 'components/editors/TextEditor';
import {
  Button,
  Timeago,
  Loader,
  Separator,
  Message,
  Tooltip
} from 'components/common';
import { ScreenRecordButton, AttachmentDropzone } from 'components/attachments';
import {
  CardStatus,
  CardTags,
  CardSideDock,
  CardCreateModal,
  CardConfirmModals,
} from 'components/cards';

import SlackIcon from 'assets/images/icons/Slack_Mark.svg';

import {
  hasValidEdits,
  toggleUpvotes,
  cardStateChanged,
  copyCardUrl,
  isApprover
} from 'utils/card';
import { copyText } from 'utils/window';
import { generateFileKey, isAnyLoading } from 'utils/file';
import { CARD, REQUEST } from 'appConstants';

import { getStyleApplicationFn } from 'utils/style';
import style from './card-content.css';

const s = getStyleApplicationFn(style);

const CardContent = (props) => {
  const footerRef = useRef(null);
  const questionRef = useRef(null);

  const [showQuestionTooltip, setShowQuestionTooltip] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    const {
      hasLoaded,
      status,
      slackThreadConvoPairs,
      slackReplies,
      openCardModal,
    } = props;
    if (
      hasLoaded &&
      status === CARD.STATUS.NOT_DOCUMENTED &&
      slackThreadConvoPairs.length !== 0 &&
      slackReplies.length === 0
    ) {
      openCardModal(CARD.MODAL_TYPE.SELECT_THREAD);
    }
  }, [props.hasLoaded]);

  useEffect(() => {
    const { requestGetCard, hasLoaded, isGettingCard } = props;
    if (!hasLoaded && !isGettingCard) {
      requestGetCard();
    }
  }, [props._id]);

  useEffect(() => {
    const questionElem = questionRef.current;
    if (questionElem) {
      setShowQuestionTooltip(questionElem.scrollHeight > questionElem.clientHeight);
    }
  }, [props.question]);

  const getAttribute = (attribute) => {
    const { isEditing, edits } = props;
    return isEditing ? edits[attribute] : props[attribute];
  };

  const getMaxDescriptionHeight = () => {
    const footerHeight = footerRef.current ? footerRef.current.clientHeight : 0;
    return (
      props.cardsHeight -
      CARD.DIMENSIONS.TABS_HEIGHT -
      footerHeight -
      CARD.DIMENSIONS.MIN_ANSWER_HEIGHT
    );
  };

  const enableDescriptionEditor = () => {
    const { disableCardEditor, enableCardEditor, adjustCardDescriptionSectionHeight } = props;
    disableCardEditor(CARD.EDITOR_TYPE.ANSWER);
    enableCardEditor(CARD.EDITOR_TYPE.DESCRIPTION);
    adjustCardDescriptionSectionHeight(getMaxDescriptionHeight());
  };

  const enableAnswerEditor = () => {
    const { disableCardEditor, enableCardEditor, adjustCardDescriptionSectionHeight } = props;
    disableCardEditor(CARD.EDITOR_TYPE.DESCRIPTION);
    enableCardEditor(CARD.EDITOR_TYPE.ANSWER);
    adjustCardDescriptionSectionHeight(CARD.DIMENSIONS.MIN_QUESTION_HEIGHT);
  };

  const editCard = () => {
    props.editCard();
    enableAnswerEditor();
  };

  const cardStatusOnClick = (prevStatus) => {
    const { openCardModal } = props;

    switch (prevStatus) {
      case CARD.STATUS.OUT_OF_DATE:
      case CARD.STATUS.NEEDS_VERIFICATION: {
        openCardModal(CARD.MODAL_TYPE.CONFIRM_UP_TO_DATE);
        break;
      }
      case CARD.STATUS.UP_TO_DATE: {
        openCardModal(CARD.MODAL_TYPE.CONFIRM_OUT_OF_DATE);
        break;
      }
      case CARD.STATUS.NEEDS_APPROVAL: {
        openCardModal(CARD.MODAL_TYPE.CONFIRM_APPROVE);
        break;
      }
      default:
        break;
    }
  };

  const cancelEditCard = () => {
    const { cancelEditCard, openCardModal } = props;
    if (cardStateChanged(props)) {
      openCardModal(CARD.MODAL_TYPE.CONFIRM_CLOSE_EDIT);
    } else {
      cancelEditCard();
    }
  };

  const getTextEditorProps = (editorRole) => {
    const {
      isEditing,
      editorEnabled,
      descriptionEditorState,
      edits,
      answerEditorState,
      updateCardDescriptionEditor,
      updateCardAnswerEditor
    } = props;

    const isDescription = editorRole === CARD.EDITOR_TYPE.DESCRIPTION;

    let defaultProps = {
      toolbarHidden: true,
      readOnly: true,
      editorState: isDescription ? descriptionEditorState : answerEditorState,
      onEditorStateChange: isDescription ? updateCardDescriptionEditor : updateCardAnswerEditor
    };

    if (!isEditing) {
      return {
        ...defaultProps,
        wrapperClassName: 'rounded-0',
        editorClassName: 'text-editor card-text-editor-view card-text-editor-view-spacing'
      };
    }

    // Add editing props
    defaultProps = {
      ...defaultProps,
      className: 'card-text-editor-edit-spacing',
      placeholder: isDescription ? 'Add a description here' : 'Add an answer here',
      editorState: isDescription ? edits.descriptionEditorState : edits.answerEditorState
    };

    if (editorEnabled[editorRole]) {
      return {
        ...defaultProps,
        editorClassName: 'bg-white',
        toolbarHidden: false,
        readOnly: false
      };
    }

    return {
      ...defaultProps,
      wrapperClassName: 'card-text-editor-wrapper-inactive',
      editorClassName: 'card-text-editor-view',
      onClick: isDescription ? () => enableDescriptionEditor() : () => enableAnswerEditor()
    };
  };

  const renderTextEditor = (editorRole) => {
    const {
      className = '',
      wrapperClassName = '',
      editorClassName = '',
      onClick,
      ...rest
    } = getTextEditorProps(editorRole);
    return (
      <TextEditor
        className={s(className)}
        onClick={() => onClick && onClick()}
        wrapperClassName={s(`flex flex-col flex-grow min-h-0 ${wrapperClassName}`)}
        editorClassName={s(`text-editor overflow-auto ${editorClassName}`)}
        toolbarClassName={s('text-editor-toolbar')}
        autoFocus
        {...rest}
      />
    );
  };

  const hasDescription = () => {
    return props.descriptionEditorState.getCurrentContent().hasText();
  };

  const addCardAttachments = (files, cardId) => {
    const { requestAddCardAttachment, _id: currCardId } = props;
    files.forEach((file) => {
      requestAddCardAttachment(cardId || currCardId, generateFileKey(), file);
    });
  };

  const renderHeaderButtons = () => {
    const { openCardSideDock, answer, _id, isEditing } = props;

    const headerButtons = [
      {
        Icon: MdContentCopy,
        toast: 'Copied answer to clipboard!',
        tooltip: 'Copy Answer',
        onClick: () => copyText(answer)
      },
      {
        Icon: IoIosShareAlt,
        toast: 'Copied link to clipboard!',
        tooltip: 'Share Card',
        className: 'text-lg',
        onClick: () => copyCardUrl(_id)
      },
      {
        Icon: MdMoreHoriz,
        label: 'More',
        tooltip: 'Advanced Settings',
        onClick: openCardSideDock,
        showEdit: true
      }
    ];

    const headerOnClick = (onClick, toast) => {
      if (toast) setToastMessage(toast);
      onClick();
    };

    return (
      <div className={s('flex items-center')}>
        {headerButtons.map(
          ({ Icon, toast, label, tooltip, onClick, className, showEdit }, i) =>
            (!isEditing || showEdit) && (
              <Tooltip show={!!tooltip} tooltip={tooltip} tooltipProps={{ place: 'left' }}>
                <button
                  onClick={() => headerOnClick(onClick, toast)}
                  className={s('flex items-center')}
                >
                  {label && <div className={s('text-xs mr-xs font-medium')}> {label} </div>}
                  <Icon
                    className={s(`${i < headerButtons.length - 1 ? 'mr-sm' : ''} ${className}`)}
                  />
                </button>
              </Tooltip>
            )
        )}
      </div>
    );
  };

  const renderAdvancedSettings = () => {
    const {
      attachments,
      openCardSideDock,
      outOfDateReason,
      tags,
      status,
      isEditing,
      cardsWidth,
      _id: cardId,
      user
    } = props;
    const currAttachments = getAttribute('attachments');
    return isEditing ? (
      <div className={s('card-content-spacing flex justify-between')}>
        {currAttachments.length !== 0 && (
          <Tooltip tooltip="View Attachments">
            <div className={s('flex items-center')}>
              <div
                className={s(
                  'flex text-purple-reg text-sm cursor-pointer underline-border border-purple-gray-20 items-center'
                )}
                onClick={openCardSideDock}
              >
                {isAnyLoading(currAttachments) ? (
                  <Loader size="sm" className={s('mr-sm')} />
                ) : (
                  <MdAttachment className={s('mr-sm')} />
                )}
                <div>
                  {currAttachments.length} Attachment{currAttachments.length !== 0 && 's'}
                </div>
              </div>
            </div>
          </Tooltip>
        )}
        <div className={s('flex ml-auto')}>
          <ScreenRecordButton
            id={cardId}
            onSuccess={({ recording, activeId }) => addCardAttachments([recording], activeId)}
            abbrText
            className={s('py-0 px-sm mr-xs')}
          />
          <AttachmentDropzone
            buttonClassName={s('py-0 px-sm')}
            showText
            onDrop={addCardAttachments}
          />
        </div>
      </div>
    ) : (
      <div className={s('card-content-spacing flex items-center justify-between')}>
        <CardTags
          tags={tags}
          onTagClick={openCardSideDock}
          maxWidth={cardsWidth * 0.5}
          isEditable={false}
        />
        <div className={s('flex flex-shrink-0 z-10 bg-purple-light ml-sm')}>
          <Tooltip tooltip="View Attachments">
            <Button
              text={attachments.length}
              iconLeft={false}
              icon={<MdAttachment className={s('ml-xs')} />}
              color={attachments.length > 0 ? 'gold' : 'secondary'}
              className={s('py-sm px-reg rounded-full')}
              onClick={openCardSideDock}
            />
          </Tooltip>
          <Separator />
          <CardStatus
            status={status}
            isActionable={status !== CARD.STATUS.NEEDS_APPROVAL || isApprover(user, tags)}
            outOfDateReason={outOfDateReason}
            onDropdownOptionClick={cardStatusOnClick}
          />
        </div>
      </div>
    );
  };

  const renderHeader = () => {
    const {
      isEditing,
      createdAt,
      lastVerified,
      lastEdited,
      sideDockOpen,
      openCardSideDock,
      closeCardSideDock,
      editorEnabled,
      descriptionSectionHeight,
      cardsWidth,
      openCardModal,
      status,
      question,
      edits,
      updateCardQuestion,
      user,
      _id: cardId,
      activeScreenRecordingId
    } = props;

    const showDescription = hasDescription() || isEditing;
    const maxDescriptionHeight = getMaxDescriptionHeight();

    return (
      <Resizable
        minHeight={showDescription ? CARD.DIMENSIONS.MIN_QUESTION_HEIGHT : 'none'}
        size={{ height: showDescription ? descriptionSectionHeight : 'auto' }}
        className={s('bg-purple-light py-sm min-h-0 flex-shrink-0 flex flex-col')}
        maxHeight={maxDescriptionHeight}
        onResizeStop={(e, direction, ref, d) => {
          props.adjustCardDescriptionSectionHeight(descriptionSectionHeight + d.height);
        }}
        enable={{
          top: false,
          right: false,
          bottom: true,
          left: false,
          topRight: false,
          bottomRight: true,
          bottomLeft: false,
          topLeft: false
        }}
      >
        <strong
          className={s(
            'card-content-spacing text-xs text-purple-reg pt-xs pb-sm flex items-center justify-between opacity-75'
          )}
        >
          {/* Case 1: Card is documented and in edit */}
          {isEditing && status !== CARD.STATUS.NOT_DOCUMENTED && (
            <div
              className={s('flex cursor-pointer')}
              onClick={() => {
                cancelEditCard();
              }}
            >
              <MdKeyboardArrowLeft className={s('text-gray-dark')} />
              <div className={s('underline text-purple-reg')}> Back to View </div>
            </div>
          )}
          {/* Case 2: Card is not yet documented */}
          {isEditing && status === CARD.STATUS.NOT_DOCUMENTED && <div> New Card </div>}

          {/* Case 3: Card is documented and not in edit */}
          {!isEditing && (
            <div className={s('flex')}>
              <Timeago date={lastEdited ? lastEdited.time : createdAt} live={false} />
              {lastVerified && lastVerified.user && (
                <div className={s('text-gray-light ml-sm font-medium italic')}>
                  (Last verified by&nbsp;
                  {lastVerified.user._id === user._id
                    ? 'you'
                    : `${lastVerified.user.firstname} ${lastVerified.user.lastname}`}
                  &nbsp;
                  <Timeago date={lastVerified.time} live={false} textTransform={_.lowerCase} />)
                </div>
              )}
            </div>
          )}
          {renderHeaderButtons()}
        </strong>
        <div className={s('card-content-spacing')}>
          {isEditing ? (
            <input
              placeholder="Title or Question"
              className={s('w-full')}
              value={edits.question}
              onChange={(e) => updateCardQuestion(e.target.value)}
            />
          ) : (
            <Tooltip
              tooltip={question}
              show={showQuestionTooltip}
              tooltipProps={{ className: s('card-question-tooltip') }}
            >
              <div
                className={s(
                  `text-2xl line-clamp-2 font-semibold ${!showDescription ? 'mb-lg' : ''}`
                )}
                ref={questionRef}
              >
                {question}
              </div>
            </Tooltip>
          )}
        </div>
        {showDescription && (
          <div className={s('flex-grow min-h-0 flex flex-col min-h-0')}>
            {renderTextEditor(CARD.EDITOR_TYPE.DESCRIPTION)}
          </div>
        )}
        {renderAdvancedSettings()}
      </Resizable>
    );
  };

  const renderAnswer = () => {
    const { isEditing, editorEnabled, selectedMessages, slackReplies, edits } = props;
    return (
      <div className={s('flex-grow min-h-0 flex flex-col min-h-0 relative')}>
        <div className={s('flex-grow min-h-0 flex flex-col min-h-0')}>
          {renderTextEditor(CARD.EDITOR_TYPE.ANSWER)}
        </div>
        {isEditing && edits.slackReplies.length !== 0 && (
          <div className={s('card-content-spacing mb-sm')}>
            <Button
              text="Manage Message Display"
              color="transparent"
              className={s('flex justify-between shadow-none')}
              icon={<FaSlack />}
              onClick={() => props.openCardModal(CARD.MODAL_TYPE.THREAD)}
              iconLeft={false}
              underline
            />
          </div>
        )}
        {!isEditing && slackReplies.length !== 0 && (
          <Button
            text="Thread"
            onClick={() => props.openCardModal(CARD.MODAL_TYPE.THREAD)}
            className={s('view-thread-button p-sm absolute text-xs mb-lg mr-lg')}
            color="secondary"
            icon={<img className={s('slack-icon ml-sm')} src={SlackIcon} alt="Slack Logo" />}
            iconLeft={false}
            underline={false}
          />
        )}
      </div>
    );
  };

  const updateCard = () => {
    const { requestUpdateCard, cancelEditCard } = props;
    if (cardStateChanged(props)) {
      requestUpdateCard();
    } else {
      cancelEditCard();
    }
  };

  const renderFooter = () => {
    const {
      isUpdatingCard,
      isEditing,
      _id,
      status,
      openCardModal,
      question,
      edits,
      modalOpen,
      upvotes,
      user,
      isTogglingUpvote,
      requestToggleUpvote,
      requestAddBookmark,
      requestRemoveBookmark,
      isUpdatingBookmark,
      activeScreenRecordingId
    } = props;

    const hasUpvoted = upvotes.some((_id) => _id === user._id);
    const hasBookmarked = user.bookmarkIds.some((bookmarkId) => bookmarkId === _id);
    const bookmarkOnClick = hasBookmarked ? requestRemoveBookmark : requestAddBookmark;
    const isRecording = activeScreenRecordingId === _id;

    return (
      <div className={s('flex-shrink-0 min-h-0 relative')} ref={footerRef}>
        {!isEditing && toastMessage && (
          <Message
            className={s('card-content-toast')}
            message={toastMessage}
            animate
            temporary
            onHide={() => setToastMessage(null)}
          />
        )}
        {isEditing ? (
          status === CARD.STATUS.NOT_DOCUMENTED ? (
            <Button
              text="Add to Knowledge Base"
              color="primary"
              onClick={() => openCardModal(CARD.MODAL_TYPE.CREATE)}
              className={s('rounded-t-none p-lg')}
              disabled={
                edits.question === '' ||
                !edits.answerEditorState.getCurrentContent().hasText() ||
                isAnyLoading(edits.attachments) ||
                isRecording
              }
              underline
            />
          ) : (
            <Button
              text="Save Updates"
              color="primary"
              onClick={updateCard}
              iconLeft={false}
              icon={
                isUpdatingCard && !modalOpen[CARD.MODAL_TYPE.CONFIRM_CLOSE] ? (
                  <Loader className={s('ml-sm')} size="sm" color="white" />
                ) : null
              }
              className={s('rounded-t-none p-lg')}
              disabled={!hasValidEdits(edits) || isUpdatingCard || isRecording}
              underline
            />
          )
        ) : (
          <div className={s('flex items-center justify-between bg-purple-light rounded-b-lg p-lg')}>
            <div className={s('flex')}>
              <Button
                text="Edit Card"
                color="primary"
                icon={<MdModeEdit className={s('mr-sm')} />}
                onClick={editCard}
              />
              {(props.status === CARD.STATUS.OUT_OF_DATE ||
                props.status === CARD.STATUS.NEEDS_VERIFICATION) && (
                <Button
                  text="Mark as Up-to-Date"
                  color="secondary"
                  className={s('ml-reg text-green-reg')}
                  underline={false}
                  icon={<MdCheck className={s('mr-sm')} />}
                  onClick={() => openCardModal(CARD.MODAL_TYPE.CONFIRM_UP_TO_DATE)}
                />
              )}
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
                  color="secondary"
                  color={hasBookmarked ? 'gold' : 'secondary'}
                  disabled={isUpdatingBookmark}
                  onClick={() => bookmarkOnClick(_id)}
                />
              </Tooltip>
            </div>
          </div>
        )}
      </div>
    );
  };

  const render = () => {
    const { hasLoaded, isGettingCard, getError, requestGetCard } = props;

    if (!hasLoaded && getError) {
      const { message, status } = getError;
      const isUnauthorized = status === REQUEST.HTTP_STATUS_CODE.UNAUTHORIZED;

      return (
        <div className={s('flex flex-col h-full justify-center items-center bg-purple-light')}>
          <div className={s('large-icon-container text-red-500')}>
            {isUnauthorized ? (
              <MdLock className={s('w-full h-full')} />
            ) : (
              <MdError className={s('w-full h-full')} />
            )}
          </div>
          <div className={s('my-lg font-semibold')}>
            {isUnauthorized ? "You don't have permissions to view this card." : message}
          </div>
          {!isUnauthorized && status !== REQUEST.HTTP_STATUS_CODE.NOT_FOUND && (
            <Button color="primary" text="Reload Card" onClick={requestGetCard} />
          )}
        </div>
      );
    }

    if (!hasLoaded || isGettingCard) {
      return (
        <div className={s('flex flex-col h-full justify-center bg-purple-light')}>
          <Loader />
        </div>
      );
    }

    return (
      <div className={s('flex-grow flex flex-col min-h-0 relative')}>
        <div className={s('flex-grow flex flex-col min-h-0')}>
          {renderHeader()}
          {renderAnswer()}
        </div>
        {renderFooter()}
        <CardSideDock />
        <CardCreateModal />
        <CardConfirmModals />
      </div>
    );
  };

  return render();
};

export default CardContent;

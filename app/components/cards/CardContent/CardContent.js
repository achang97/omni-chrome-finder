import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { MdCheck, MdArrowDropDown, MdCloudUpload, MdMoreHoriz, MdModeEdit, MdThumbUp, MdBookmarkBorder, MdError, MdPerson, MdAttachment, MdKeyboardArrowLeft, MdLock, MdContentCopy } from 'react-icons/md';
import { IoIosShareAlt } from 'react-icons/io';
import { FaSlack } from 'react-icons/fa';
import { EditorState } from 'draft-js';
import { Resizable } from 're-resizable';

import TextEditor from 'components/editors/TextEditor';
import { Button, Dropzone, Timeago, Modal, CheckBox, Loader, Separator, Message } from 'components/common';
import { ScreenRecordButton, AttachmentDropzone } from 'components/attachments';
import { CardStatus, CardTags, CardSideDock, CardCreateModal, CardConfirmModals, CardConfirmModal } from 'components/cards';

import SlackIcon from 'assets/images/icons/Slack_Mark.svg';

import { hasValidEdits, toggleUpvotes, cardStateChanged, copyCardUrl } from 'utils/card';
import { copyText } from 'utils/window';
import { generateFileKey, isAnyLoading } from 'utils/file';
import { CARD, REQUEST, PROFILE } from 'appConstants';

import style from './card-content.css';
import { getStyleApplicationFn } from 'utils/style';

const s = getStyleApplicationFn(style);

const CardContent = (props) => {
  const footerRef = useRef(null);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    const { hasLoaded, status, slackThreadConvoPairs, slackReplies, openCardModal } = props;
    if (hasLoaded && status === CARD.STATUS.NOT_DOCUMENTED && slackThreadConvoPairs.length !== 0 && slackReplies.length === 0) {
      openCardModal(CARD.MODAL_TYPE.SELECT_THREAD);
    }
  }, [props.hasLoaded]);

  useEffect(() => {
    const { requestGetCard, hasLoaded, isGettingCard } = props;
    if (!hasLoaded && !isGettingCard) {
      requestGetCard();
    }
  }, [props._id]);

  const getAttribute = (attribute) => {
    const { isEditing, edits } = props;
    return isEditing ? edits[attribute] : props[attribute];
  }

  const enableDescriptionEditor = () => {
    const { disableCardEditor, enableCardEditor, adjustCardDescriptionSectionHeight } = props;
    disableCardEditor(CARD.EDITOR_TYPE.ANSWER);
    enableCardEditor(CARD.EDITOR_TYPE.DESCRIPTION);
    adjustCardDescriptionSectionHeight(getMaxDescriptionHeight());
  }

  const enableAnswerEditor = () => {
    const { disableCardEditor, enableCardEditor, adjustCardDescriptionSectionHeight } = props;
    disableCardEditor(CARD.EDITOR_TYPE.DESCRIPTION);
    enableCardEditor(CARD.EDITOR_TYPE.ANSWER);
    adjustCardDescriptionSectionHeight(CARD.DIMENSIONS.MIN_QUESTION_HEIGHT);
  }

  const editCard = () => {
    props.editCard();
    enableAnswerEditor();
  }

  const getMaxDescriptionHeight = () => {
    const footerHeight = footerRef.current ? footerRef.current.clientHeight : 0;
    return props.cardsHeight - CARD.DIMENSIONS.TABS_HEIGHT - footerHeight - CARD.DIMENSIONS.MIN_ANSWER_HEIGHT;
  }

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
    }
  }

  const cancelEditCard = () => {
    const { cancelEditCard, openCardModal } = props;
    if (cardStateChanged(props)) {
      openCardModal(CARD.MODAL_TYPE.CONFIRM_CLOSE_EDIT);
    } else {
      cancelEditCard();
    }
  }

  const getTextEditorProps = (editorRole) => {
    const {
      isEditing, editorEnabled, descriptionEditorState, edits, answerEditorState,
      updateCardDescriptionEditor, updateCardAnswerEditor,
    } = props;

    let defaultProps;
    if (editorRole === CARD.EDITOR_TYPE.DESCRIPTION) {
      defaultProps = { className: 'my-reg', wrapperClassName: '', toolbarHidden: true, readOnly: true, editorState: descriptionEditorState, onEditorStateChange: updateCardDescriptionEditor, onClick: undefined };
    } else {
      defaultProps = { className: 'mt-sm mb-reg', wrapperClassName: '', toolbarHidden: true, readOnly: true, editorState: answerEditorState, onEditorStateChange: updateCardAnswerEditor, onClick: undefined };
    }

    if (!isEditing) {
      return {
        ...defaultProps,
        wrapperClassName: 'rounded-0',
        editorClassName: 'text-editor card-text-editor-view p-0',
      };
    }

    if (editorEnabled[editorRole]) {
      return {
        ...defaultProps,
        editorClassName: 'bg-white',
        editorState: editorRole === CARD.EDITOR_TYPE.DESCRIPTION ? edits.descriptionEditorState : edits.answerEditorState,
        toolbarHidden: false,
        readOnly: false,
      };
    }
    return {
      ...defaultProps,
      wrapperClassName: 'card-text-editor-wrapper-inactive',
      editorClassName: 'card-text-editor-view',
      editorState: editorRole === CARD.EDITOR_TYPE.DESCRIPTION ? edits.descriptionEditorState : edits.answerEditorState,
      onClick: editorRole === CARD.EDITOR_TYPE.DESCRIPTION ? () => enableDescriptionEditor() : () => enableAnswerEditor(),
    };


    return {};
  }

  const renderTextEditor = (editorRole) => {
    const { className, wrapperClassName, editorClassName, editorState, toolbarHidden, readOnly, onEditorStateChange, onClick } = getTextEditorProps(editorRole);
    return (
      <TextEditor
        className={s(`${className}`)}
        onClick={() => onClick && onClick()}
        onEditorStateChange={onEditorStateChange}
        editorState={editorState}
        wrapperClassName={s(`flex flex-col flex-grow min-h-0 ${wrapperClassName}`)}
        editorClassName={s(`text-editor overflow-auto ${editorClassName}`)}
        toolbarClassName={s('text-editor-toolbar')}
        editorRole={editorRole}
        toolbarHidden={toolbarHidden}
        readOnly={readOnly}
        autoFocus
      />
    );
  }

  const addCardAttachments = (files) => {
    const { requestAddCardAttachment } = props;
    files.forEach((file) => {
      requestAddCardAttachment(generateFileKey(), file);
    });
  }

  const shareCard = () => {
    setToastMessage('Copied link to clipboard!');
    copyCardUrl(props._id);
  }

  const renderHeader = () => {
    const {
      isEditing, tags, createdAt, outOfDateReason, lastVerified, lastEdited,
      sideDockOpen, openCardSideDock, closeCardSideDock,
      editorEnabled, descriptionSectionHeight, cardsWidth,
      attachments, addCardAttachments, openCardModal, status,
      updateCardQuestion,
      user
    } = props;

    const currAttachments = getAttribute('attachments');
    const isApprover = user.role === PROFILE.USER_ROLE.ADMIN ||
      tags.some(({ approvers }) => approvers.some(({ _id }) => _id === user._id));

    return (
      <Resizable
        className={s('bg-purple-light py-sm px-2xl min-h-0 flex-shrink-0 flex flex-col')}
        defaultSize={{ height: CARD.DIMENSIONS.MIN_QUESTION_HEIGHT }}
        minHeight={CARD.DIMENSIONS.MIN_QUESTION_HEIGHT}
        maxHeight={getMaxDescriptionHeight()}
        size={{ height: descriptionSectionHeight }}
        onResizeStop={(e, direction, ref, d) => {
          props.adjustCardDescriptionSectionHeight(descriptionSectionHeight + d.height);
        }}
        enable={{ top: false, right: false, bottom: true, left: false, topRight: false, bottomRight: true, bottomLeft: false, topLeft: false }}
      >
        <strong className={s('text-xs text-purple-reg pt-xs pb-sm flex items-center justify-between opacity-75')}>
          {/* Case 1: Card is documented and in edit*/}
          { (isEditing && status !== CARD.STATUS.NOT_DOCUMENTED) &&
          <div className={s('flex cursor-pointer')} onClick={() => { cancelEditCard(); }}>
            <MdKeyboardArrowLeft className={s('text-gray-dark')} />
            <div className={s('underline text-purple-reg')}> Back to View </div>
          </div>
          }
          {/* Case 2: Card is not yet documented */}
          { (isEditing && status === CARD.STATUS.NOT_DOCUMENTED) && <div> New Card </div> }

          {/* Case 3: Card is documented and not in edit */}
          { !isEditing &&
            <div className={s('flex')}>
              <Timeago date={lastEdited ? lastEdited.time : createdAt} live={false} />
              { lastVerified && lastVerified.user &&
                <div className={s('text-gray-light ml-sm font-medium italic')}>
                  (Last verified by&nbsp;
                  {lastVerified.user._id === user._id ?
                    'you' : `${lastVerified.user.firstname} ${lastVerified.user.lastname}`
                  }
                  &nbsp;
                  <Timeago date={lastVerified.time} live={false} textTransform={_.lowerCase} />)
                </div>
              }
            </div>
          }
          <div className={s('flex items-center')}>
            <button onClick={shareCard} className={s('mr-sm text-lg')}>
              <IoIosShareAlt />
            </button>
            <button onClick={openCardSideDock}>
              <MdMoreHoriz />
            </button>
          </div>
        </strong>
        { isEditing ?
          <input
            placeholder="Question"
            className={s('w-full')}
            value={props.edits.question}
            onChange={e => updateCardQuestion(e.target.value)}
          /> :
          <div className={s('text-2xl font-semibold')}>{props.question}</div>
        }
        <div className={s('flex-grow min-h-0 flex flex-col min-h-0')}>
          { renderTextEditor(CARD.EDITOR_TYPE.DESCRIPTION) }
        </div>
        { isEditing &&
        <div className={s('flex justify-between')}>
          { currAttachments.length !== 0 &&
            <div className={s('flex items-center')}>
              <div className={s('flex text-purple-reg text-sm cursor-pointer underline-border border-purple-gray-20 items-center')} onClick={openCardSideDock}>
                { isAnyLoading(currAttachments) ? 
                  <Loader size="sm" className={s('mr-sm')} /> :
                  <MdAttachment className={s('mr-sm')} />
                }
                <div> {currAttachments.length} Attachment{currAttachments.length !== 0 && 's'}</div>
              </div>
            </div>
          }
          <div className={s('flex ml-auto')}>
            <ScreenRecordButton
              onSuccess={recording => addCardAttachments([recording])}
              abbrText={true}
              className={s('py-0 px-sm mr-xs')}
            />
            <AttachmentDropzone
              buttonClassName={s('py-0 px-sm')}
              showText={true}
              onDrop={addCardAttachments}
            />
          </div>
        </div>
        }
        { !isEditing &&
        <div className={s('flex items-center justify-between')}>
          <CardTags
            tags={tags}
            onTagClick={openCardSideDock}
            maxWidth={cardsWidth * 0.5}
            isEditable={false}
          />
          <div className={s('flex flex-shrink-0 z-10 bg-purple-light ml-sm')}>
            <Button
              text={attachments.length}
              iconLeft={false}
              icon={<MdAttachment className={s('ml-xs')} />}
              color={'secondary'}
              className={s('py-sm px-reg rounded-full')}
              onClick={openCardSideDock}
            />
            <Separator />
            <CardStatus
              status={props.status}
              isActionable={status !== CARD.STATUS.NEEDS_APPROVAL || isApprover}
              outOfDateReason={outOfDateReason}
              onDropdownOptionClick={cardStatusOnClick}
            />
          </div>
        </div>
        }
      </Resizable>
    );
  }

  const copyAnswer = () => {
    setToastMessage('Copied answer to clipboard!');
    copyText(props.answer);
  }

  const renderAnswer = () => {
    const { isEditing, editorEnabled, selectedMessages, slackReplies, edits } = props;
    return (
      <div className={s('px-2xl py-sm flex-grow min-h-0 flex flex-col min-h-0 relative')}>
        { !isEditing &&
          <button
            className={s('bg-white shadow-md rounded-full w-2xl h-2xl flex items-center justify-center absolute top-0 right-0 m-reg z-10')}
            onClick={copyAnswer}
          >
            <MdContentCopy className={s('text-gray-dark')} />          
          </button>
        }
        <div className={s('flex-grow min-h-0 flex flex-col min-h-0')}>
          { renderTextEditor(CARD.EDITOR_TYPE.ANSWER) }
        </div>
        { isEditing && edits.slackReplies.length !== 0 &&
          <Button
            text={'Manage Message Display'}
            color={'transparent'}
            className={s('flex justify-between shadow-none')}
            icon={<FaSlack />}
            onClick={() => props.openCardModal(CARD.MODAL_TYPE.THREAD)}
            iconLeft={false}
            underline
          />
        }
        { !isEditing && slackReplies.length !== 0 &&
          <Button
            text={'Thread'}
            onClick={() => props.openCardModal(CARD.MODAL_TYPE.THREAD)}
            className={s('view-thread-button p-sm absolute text-xs mb-lg mr-2xl')}
            color={'secondary'}
            imgSrc={SlackIcon}
            imgClassName={s('slack-icon ml-sm')}
            iconLeft={false}
            underline={false}
          />
        }
      </div>
    );
  }

  const renderFooter = () => {
    const {
      isUpdatingCard, isEditing, _id, status, openCardModal, question, edits, requestUpdateCard, modalOpen,
      upvotes, user, isTogglingUpvote, requestToggleUpvote,
      requestAddBookmark, requestRemoveBookmark, isUpdatingBookmark,
    } = props;

    const hasUpvoted = upvotes.some(_id => _id === user._id);
    const hasBookmarked = user.bookmarkIds.some(bookmarkId => bookmarkId === _id);
    const bookmarkOnClick = hasBookmarked ? requestRemoveBookmark : requestAddBookmark;

    return (
      <div className={s('flex-shrink-0 min-h-0 relative')} ref={footerRef}>
        { !isEditing && toastMessage &&
          <Message
            className={s('card-content-toast')}
            message={toastMessage}
            animate
            temporary
            onHide={() => setToastMessage(null)}
          />
        }
        { isEditing ?
          (status === CARD.STATUS.NOT_DOCUMENTED ?
            <Button
              text={'Add to Knowledge Base'}
              color="primary"
              onClick={() => openCardModal(CARD.MODAL_TYPE.CREATE)}
              className={s('rounded-t-none p-lg')}
              disabled={
                edits.question === '' ||
                !edits.answerEditorState.getCurrentContent().hasText() ||
                isAnyLoading(edits.attachments)
              }
              underline
            /> :
            <Button
              text={'Save Updates'}
              color="primary"
              onClick={requestUpdateCard}
              iconLeft={false}
              icon={isUpdatingCard && !modalOpen[CARD.MODAL_TYPE.CONFIRM_CLOSE] ? <Loader className={s('ml-sm')} size="sm" color="white" /> : null}
              className={s('rounded-t-none p-lg')}
              disabled={!hasValidEdits(edits) || isUpdatingCard}
              underline
            />
          ) :
            <div className={s('flex items-center justify-between bg-purple-light rounded-b-lg p-lg')}>
              <div className={s('flex')}>
                <Button
                  text={'Edit Card'}
                  color="primary"
                  icon={<MdModeEdit className={s('mr-sm')} />}
                  onClick={editCard}
                />
                { (props.status === CARD.STATUS.OUT_OF_DATE || props.status === CARD.STATUS.NEEDS_VERIFICATION) &&
                <Button
                  text={'Mark as Up-to-Date'}
                  color="secondary"
                  className={s('ml-reg text-green-reg')}
                  underline={false}
                  icon={<MdCheck className={s('mr-sm')} />}
                  onClick={() => openCardModal(CARD.MODAL_TYPE.CONFIRM_UP_TO_DATE)}
                />
              }
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
                <Button
                  icon={<MdBookmarkBorder />}
                  color={'secondary'}
                  color={hasBookmarked ? 'gold' : 'secondary'}
                  disabled={isUpdatingBookmark}
                  onClick={() => bookmarkOnClick(_id)}
                />
              </div>
            </div>
        }
      </div>
    );
  }

  const render = () => {
    const {
      hasLoaded, isGettingCard, getError,
      isEditing, tags, sideDockOpen, closeCardModal, modalOpen, openCardSideDock, closeCardSideDock, status,
      requestGetCard
    } = props;

    if (!hasLoaded && getError) {
      const { message, status } = getError;
      const isUnauthorized = status === REQUEST.HTTP_STATUS_CODE.UNAUTHORIZED;

      return (
        <div className={s('flex flex-col h-full justify-center items-center bg-purple-light')}>
          <div className={s('large-icon-container text-red-500')}>
            { isUnauthorized ?
              <MdLock className={s('w-full h-full')} /> :
              <MdError className={s('w-full h-full')} />
            }
          </div>
          <div className={s('my-lg font-semibold')}>
            { isUnauthorized ? 'You don\'t have permissions to view this card.' : message }
          </div>
          { !isUnauthorized && status !== REQUEST.HTTP_STATUS_CODE.NOT_FOUND &&
            <Button
              color="primary"
              text="Reload Card"
              onClick={requestGetCard}
            />
          }
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
          { renderHeader() }
          { renderAnswer() }
        </div>
        { renderFooter() }
        <CardSideDock />
        <CardCreateModal />
        <CardConfirmModals />
      </div>
    );
  }

  return render();
}

export default CardContent;

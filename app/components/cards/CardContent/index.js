import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MdCheck, MdArrowDropDown, MdMoreHoriz, MdModeEdit, MdThumbUp, MdBookmarkBorder, MdError, MdPerson, MdAttachment, MdKeyboardArrowLeft, MdLock } from 'react-icons/md';
import Timeago from 'react-timeago';
import SlackIcon from '../../../assets/images/icons/Slack_Mark.svg';

import { FaSlack } from 'react-icons/fa';
import { EditorState } from 'draft-js';
import TextEditor from '../../editors/TextEditor';
import Button from '../../common/Button';
import Modal from '../../common/Modal';
import CheckBox from '../../common/CheckBox';
import Loader from '../../common/Loader';

import CardStatus from '../CardStatus';
import CardTags from '../CardTags';
import { Resizable } from 're-resizable';
import Dropzone from '../../common/Dropzone';
import CardSideDock from '../CardSideDock';
import CardCreateModal from '../CardCreateModal';
import CardConfirmModal from '../CardConfirmModal';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as cardActions from '../../../actions/cards';

import { hasValidEdits, toggleUpvotes, cardStateChanged } from '../../../utils/card';
import { generateFileKey } from '../../../utils/file';
import { CARD_STATUS, CARD_DIMENSIONS, EDITOR_TYPE, MODAL_TYPE, USER_ROLE, HTTP_STATUS_CODE } from '../../../utils/constants';

import style from './card-content.css';
import { getStyleApplicationFn } from '../../../utils/style';

const s = getStyleApplicationFn(style);

class CardContent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      footerHeight: 0,
    };
  }

  componentDidMount() {
    if (!this.props.hasLoaded) {
      this.loadCard();
    }

    if (this.footerRef) {
      this.setState({ footerHeight: this.footerRef.clientHeight });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      _id, hasLoaded, isGettingCard, status,
      slackReplies, slackThreadConvoPairs,
      openCardModal
    } = this.props;

    if (prevProps._id !== _id && !hasLoaded && !isGettingCard) {
      this.loadCard();
    } else if (!prevProps.hasLoaded && hasLoaded) {
      if (status === CARD_STATUS.NOT_DOCUMENTED && slackThreadConvoPairs.length !== 0 && slackReplies.length === 0) {
        openCardModal(MODAL_TYPE.SELECT_THREAD);
      }
    }

    if (this.footerRef && prevState.footerHeight !== this.footerRef.clientHeight) {
      this.setState({ footerHeight: this.footerRef.clientHeight });
    }
  }

  loadCard = () => {
    this.props.requestGetCard();
  }

  getAttribute = (attribute) => {
    const { isEditing, edits } = this.props;
    return isEditing ? edits[attribute] : this.props[attribute];
  }

  enableDescriptionEditor = () => {
    this.disableAnswerEditor();
    this.props.enableCardEditor(EDITOR_TYPE.DESCRIPTION);
    this.props.adjustCardDescriptionSectionHeight(this.getMaxDescriptionHeight());
  }

  disableDescriptionEditor = () => {
    this.props.disableCardEditor(EDITOR_TYPE.DESCRIPTION);
  }

  enableAnswerEditor = () => {
    this.disableDescriptionEditor();
    this.props.enableCardEditor(EDITOR_TYPE.ANSWER);
    this.props.adjustCardDescriptionSectionHeight(CARD_DIMENSIONS.MIN_QUESTION_HEIGHT);
  }

  disableAnswerEditor = () => {
    this.props.disableCardEditor(EDITOR_TYPE.ANSWER);
  }

  editCard = () => {
    this.props.editCard();
    this.enableAnswerEditor();
  }

  saveCard = () => {
    this.disableDescriptionEditor();
    this.props.saveCard();
  }

  saveMessages = () => {
    this.props.closeCardModal(MODAL_TYPE.THREAD);
  }

  onAnswerEditorStateChange = (editorState) => {
    this.props.updateCardAnswerEditor(editorState);
  }

  onDescriptionEditorStateChange = (editorState) => {
    this.props.updateCardDescriptionEditor(editorState);
  }

  getMaxDescriptionHeight = () => this.props.cardsHeight - CARD_DIMENSIONS.TABS_HEIGHT - this.state.footerHeight - CARD_DIMENSIONS.MIN_ANSWER_HEIGHT

  toggleSelectedMessage = (i) => {
    this.props.toggleCardSelectedMessage(i);
  }

  updateQuestionValue = (event) => {
    this.props.updateCardQuestion(event.target.value);
  }

  cardStatusOnClick = (prevStatus) => {
    const { openCardModal } = this.props;

    switch (prevStatus) {
      case CARD_STATUS.OUT_OF_DATE:
      case CARD_STATUS.NEEDS_VERIFICATION: {
        openCardModal(MODAL_TYPE.CONFIRM_UP_TO_DATE);
        break;
      }
      case CARD_STATUS.UP_TO_DATE: {
        openCardModal(MODAL_TYPE.CONFIRM_OUT_OF_DATE);
        break;
      }
      case CARD_STATUS.NEEDS_APPROVAL: {
        openCardModal(MODAL_TYPE.CONFIRM_APPROVE);
        break;
      }
    }
  }

  cancelEditCard = () => {
    const { cancelEditCard, openCardModal } = this.props;
    if (cardStateChanged(this.props)) {
      openCardModal(MODAL_TYPE.CONFIRM_CLOSE_EDIT);
    } else {
      cancelEditCard();
    }
  }

  getTextEditorProps = (editorRole) => {
    const { isEditing, editorEnabled, descriptionEditorState, edits, answerEditorState } = this.props;

    let defaultProps;
    if (editorRole === EDITOR_TYPE.DESCRIPTION) {
      defaultProps = { className: 'my-reg', wrapperClassName: '', toolbarHidden: true, readOnly: true, editorState: descriptionEditorState, onEditorStateChange: this.onDescriptionEditorStateChange, onClick: undefined };
    } else {
      defaultProps = { className: 'mt-sm mb-reg', wrapperClassName: '', toolbarHidden: true, readOnly: true, editorState: answerEditorState, onEditorStateChange: this.onAnswerEditorStateChange, onClick: undefined };
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
        editorState: editorRole === EDITOR_TYPE.DESCRIPTION ? edits.descriptionEditorState : edits.answerEditorState,
        toolbarHidden: false,
        readOnly: false,
      };
    }
    return {
      ...defaultProps,
      wrapperClassName: 'card-text-editor-wrapper-inactive',
      editorClassName: 'card-text-editor-view',
      editorState: editorRole === EDITOR_TYPE.DESCRIPTION ? edits.descriptionEditorState : edits.answerEditorState,
      onClick: editorRole === EDITOR_TYPE.DESCRIPTION ? () => this.enableDescriptionEditor() : () => this.enableAnswerEditor(),
    };


    return {};
  }

  renderTextEditor = (editorRole) => {
    const { className, wrapperClassName, editorClassName, editorState, toolbarHidden, readOnly, onEditorStateChange, onClick } = this.getTextEditorProps(editorRole);
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

  addCardAttachments = (files) => {
    const { requestAddCardAttachment } = this.props;
    files.forEach((file) => {
      requestAddCardAttachment(generateFileKey(), file);
    });
  }

  renderHeader = () => {
    const {
      isEditing, tags, createdAt, outOfDateReason,
      sideDockOpen, openCardSideDock, closeCardSideDock,
      editorEnabled, descriptionSectionHeight, cardsWidth,
      attachments, addCardAttachments, openCardModal, status,
      user
    } = this.props;

    const currAttachments = this.getAttribute('attachments');
    const isApprover = user.role === USER_ROLE.ADMIN ||
      tags.some(({ approvers }) => approvers.some(({ _id }) => _id === user._id));

    return (
      <Resizable
        className={s('bg-purple-light py-sm px-2xl min-h-0 flex-shrink-0 flex flex-col')}
        defaultSize={{ height: CARD_DIMENSIONS.MIN_QUESTION_HEIGHT }}
        minHeight={CARD_DIMENSIONS.MIN_QUESTION_HEIGHT}
        maxHeight={this.getMaxDescriptionHeight()}
        size={{ height: descriptionSectionHeight }}
        onResizeStop={(e, direction, ref, d) => {
          this.props.adjustCardDescriptionSectionHeight(descriptionSectionHeight + d.height);
        }}
        enable={{ top: false, right: false, bottom: true, left: false, topRight: false, bottomRight: true, bottomLeft: false, topLeft: false }}
      >
        <strong className={s('text-xs text-purple-reg pt-xs pb-sm flex items-center justify-between opacity-75')}>
          {/* Case 1: Card is documented and in edit*/}
          { (isEditing && status !== CARD_STATUS.NOT_DOCUMENTED) &&
          <div className={s('flex cursor-pointer')} onClick={() => { this.cancelEditCard(); }}>
            <MdKeyboardArrowLeft className={s('text-gray-dark')} />
            <div className={s('underline text-purple-reg')}> Back to View </div>
          </div>
          }
          {/* Case 2: Card is not yet documented */}
          { (isEditing && status === CARD_STATUS.NOT_DOCUMENTED) && <div> New Card </div> }

          {/* Case 3: Card is documented and not in edit */}
          { !isEditing && <div> <Timeago date={createdAt} live={false} /> </div> }
          <div className={s('flex items-center')}>
            <button onClick={openCardSideDock}>
              <MdMoreHoriz />
            </button>
          </div>
        </strong>
        { isEditing ?
          <input
            placeholder="Question"
            className={s('w-full')}
            value={this.props.edits.question}
            onChange={this.updateQuestionValue}
          /> :
          <div className={s('text-2xl font-semibold')}>{this.props.question}</div>
        }
        <div className={s('flex-grow min-h-0 flex flex-col min-h-0')}>
          { this.renderTextEditor(EDITOR_TYPE.DESCRIPTION) }
        </div>
        { isEditing &&
        <div className={s('flex justify-between')}>
          { currAttachments.length !== 0 &&
          <div className={s('flex items-center')}>
            <div className={s('flex text-purple-reg text-sm cursor-pointer underline-border border-purple-gray-20 items-center')} onClick={openCardSideDock}>
              <MdAttachment className={s('mr-sm')} />
              <div> {currAttachments.length} Attachment{currAttachments.length !== 0 && 's'}</div>
            </div>
          </div>
            }
          <Dropzone className={s('ml-auto')} onDrop={this.addCardAttachments}>
            <p className={s('m-0 text-sm text-purple-reg p-sm py-0')}>Drag Files Here or Click to Add</p>
          </Dropzone>
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
            <div className={s('vertical-separator')} />
            <CardStatus
              status={this.props.status}
              isActionable={status !== CARD_STATUS.NEEDS_APPROVAL || isApprover}
              outOfDateReason={outOfDateReason}
              onDropdownOptionClick={this.cardStatusOnClick}
            />
          </div>
        </div>
        }
      </Resizable>
    );
  }

  renderAnswer = () => {
    const { isEditing, editorEnabled, selectedMessages, slackReplies, edits } = this.props;
    return (
      <div className={s('px-2xl py-sm flex-grow min-h-0 flex flex-col min-h-0 relative')}>
        <div className={s('flex-grow min-h-0 flex flex-col min-h-0')}>
          { this.renderTextEditor(EDITOR_TYPE.ANSWER) }
        </div>
        { isEditing && edits.slackReplies.length !== 0 &&
          <Button
            text={'Manage Message Display'}
            color={'transparent'}
            className={s('flex justify-between shadow-none')}
            icon={<FaSlack />}
            onClick={() => this.props.openCardModal(MODAL_TYPE.THREAD)}
            iconLeft={false}
            underline
          />
        }
        { !isEditing && slackReplies.length !== 0 &&
          <Button
            text={'Thread'}
            onClick={() => this.props.openCardModal(MODAL_TYPE.THREAD)}
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

  updateCardStatus = (newStatus) => {
    const { openCardModal } = this.props;
    if (newStatus === CARD_STATUS.UP_TO_DATE) {
      openCardModal(MODAL_TYPE.CONFIRM_UP_TO_DATE);
    }
  }

  renderFooter = () => {
    const {
      isUpdatingCard, isEditing, _id, status, openCardModal, question, edits, requestUpdateCard, modalOpen,
      upvotes, user, isTogglingUpvote, requestToggleUpvote,
      requestAddBookmark, requestRemoveBookmark, isUpdatingBookmark,
    } = this.props;

    const hasUpvoted = upvotes.some(_id => _id === user._id);
    const hasBookmarked = user.bookmarkIds.some(bookmarkId => bookmarkId === _id);
    const bookmarkOnClick = hasBookmarked ? requestRemoveBookmark : requestAddBookmark;

    return (
      <div className={s('flex-shrink-0 min-h-0')} ref={element => this.footerRef = element}>
        { isEditing ?
          (status === CARD_STATUS.NOT_DOCUMENTED ?
            <Button
              text={'Add to Knowledge Base'}
              color="primary"
              onClick={() => openCardModal(MODAL_TYPE.CREATE)}
              className={s('rounded-t-none p-lg')}
              disabled={edits.question === '' || !edits.answerEditorState.getCurrentContent().hasText()}
              underline
            /> :
            <Button
              text={'Save Updates'}
              color="primary"
              onClick={requestUpdateCard}
              iconLeft={false}
              icon={isUpdatingCard && !modalOpen[MODAL_TYPE.CONFIRM_CLOSE] ? <Loader className={s('ml-sm')} size="sm" color="white" /> : null}
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
                  onClick={this.editCard}
                />
                { (this.props.status === CARD_STATUS.OUT_OF_DATE || this.props.status === CARD_STATUS.NEEDS_VERIFICATION) &&
                <Button
                  text={'Mark as Up-to-Date'}
                  color="secondary"
                  className={s('ml-reg text-green-reg')}
                  underline={false}
                  icon={<MdCheck className={s('mr-sm')} />}
                  onClick={() => openCardModal(MODAL_TYPE.CONFIRM_UP_TO_DATE)}
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

  closeThreadModal = () => {
    const { closeCardModal, cancelEditCardMessages } = this.props;
    closeCardModal(MODAL_TYPE.THREAD);
    cancelEditCardMessages();
  }

  renderModalThreadBody = () => {
    const { isEditing, slackReplies, edits } = this.props;
    const currSlackReplies = isEditing ? edits.slackReplies : slackReplies;

    return (
      <div className={s('message-manager-container')}>
        {currSlackReplies.length === 0 &&
          <div className={s("text-center p-lg")}>
            No Slack replies to display
          </div>
        }
        {currSlackReplies.map(({ id, senderName, senderImageUrl, message, selected }, i) => ((isEditing || selected) &&
          <div key={id} className={s(`flex p-reg   ${i % 2 === 0 ? '' : 'bg-purple-gray-10'} `)}>
            <img src={senderImageUrl} className={s('message-photo-container rounded-lg flex-shrink-0 flex justify-center mr-reg shadow-md')} />
            <div className={s('flex flex-col flex-grow')}>
              <div className={s('flex items-end')}>
                <div className={s('text-sm font-semibold mr-reg')}> { senderName } </div>
                {/*<div className={s("text-sm text-gray-dark")}> { time } </div>*/}
              </div>
              <div className={s('mt-sm text-sm')}>
                {message}
              </div>
            </div>
            {isEditing &&
              <CheckBox
                isSelected={selected}
                toggleCheckbox={() => this.toggleSelectedMessage(i)}
                className={s('flex-shrink-0 margin-sm')}
              />
            }
          </div>
        ))}
      </div>
    );
  }

  renderSelectThreadBody = () => {
    const {
      slackThreadConvoPairs=[], updateCardSelectedThreadIndex,
      slackThreadIndex,
    } = this.props;
    return (
      <div className={s('message-manager-container')}>
        {slackThreadConvoPairs.map(({ _id, threadId, channelId, channelName }, i) => {
          const isSelected = i === slackThreadIndex;
          return (
            <div key={_id} className={s(`flex p-reg items-center justify-between ${i % 2 === 0 ? '' : 'bg-purple-gray-10'} `)}>
              <div className={s(`${isSelected ? 'font-semibold' : 'text-gray-light font-medium'} text-md`)}>
                {channelId.charAt(0) === 'U' ? '@' : '#'}{channelName}
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
  }

  confirmCloseModalUndocumentedPrimary = () => {
    const { closeCardModal, closeCard, activeCardIndex } = this.props;
    closeCardModal(MODAL_TYPE.CONFIRM_CLOSE);
    closeCard(activeCardIndex);
  }

  confirmUpToDateModalPrimary = () => {
    const { closeCardModal, updateCardStatus } = this.props;
    closeCardModal(MODAL_TYPE.CONFIRM_UP_TO_DATE);
    updateCardStatus(CARD_STATUS.UP_TO_DATE);
  }

  confirmUpToDateSaveModalPrimary = () => {
    const { closeCardModal, updateCardStatus } = this.props;
    closeCardModal(MODAL_TYPE.CONFIRM_UP_TO_DATE_SAVE);
    updateCardStatus(CARD_STATUS.UP_TO_DATE);
  }

  confirmCloseEditModalSecondary = () => {
    const { cancelEditCard, closeCardModal } = this.props;
    closeCardModal(MODAL_TYPE.CONFIRM_CLOSE_EDIT);
    cancelEditCard();
  }

  getModalLoaderProps = (loaderCondition, defaultIcon) => ({
    iconLeft: false,
    icon: loaderCondition ? <Loader className={s('ml-sm')} size="sm" color="white" /> : defaultIcon,
    disabled: loaderCondition,
  })

  renderModals = () => {
    const {
      closeCardModal, closeCard, activeCardIndex,
      requestDeleteCard, deleteError, isDeletingCard,
      requestUpdateCard, updateError, isUpdatingCard,
      requestMarkUpToDate, requestMarkOutOfDate, requestApproveCard, isMarkingStatus, markStatusError,
      requestGetSlackThread, isGettingSlackThread, getSlackThreadError, 
      outOfDateReasonInput, updateOutOfDateReason, cancelEditCard,
      modalOpen,
      isEditing,
    } = this.props;

    const MODALS = [
      {
        modalType: MODAL_TYPE.THREAD,
        title: isEditing ? 'Unselect messages you do not want shown' : 'View Slack Thread',
        shouldCloseOnOutsideClick: true,
        onRequestClose: this.closeThreadModal,
        showPrimary: isEditing,
        showSecondary: false,
        bodyClassName: s('p-0'),
        body: this.renderModalThreadBody(),
        primaryButtonProps: {
          text: 'Save',
          onClick: () => closeCardModal(MODAL_TYPE.THREAD),
          className: s('rounded-t-none flex-1'),
        }
      }, {
        modalType: MODAL_TYPE.SELECT_THREAD,
        title: 'Select thread for reference',
        shouldCloseOnOutsideClick: false,
        canClose: false,
        showSecondary: false,
        bodyClassName: s('p-0'),
        body: this.renderSelectThreadBody(),
        error: getSlackThreadError,
        primaryButtonProps: {
          text: 'Select',
          onClick: requestGetSlackThread,
          className: s('rounded-t-none flex-1'),
          ...this.getModalLoaderProps(isGettingSlackThread)
        }
      }, {
        modalType: MODAL_TYPE.CONFIRM_CLOSE,
        title: 'Save Changes',
        description: 'You have unsaved changes on this card. Would you like to save your changes before closing?',
        primaryButtonProps: {
          text: 'Save',
          onClick: () => requestUpdateCard({ closeCard: true }),
          ...this.getModalLoaderProps(isUpdatingCard)
        },
        secondaryButtonProps: {
          text: 'No',
          onClick: () => closeCard(activeCardIndex)
        }
      }, {
        modalType: MODAL_TYPE.CONFIRM_CLOSE_UNDOCUMENTED,
        title: 'Close Card',
        description: 'You have not yet documented this card. All changes will be lost upon closing. Are you sure you want to close this card?',
        primaryButtonProps: {
          text: 'Close Card',
          onClick: this.confirmCloseModalUndocumentedPrimary
        }
      }, {
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
              onChange={e => updateOutOfDateReason(e.target.value)}
            />
          </div>
        ),
        error: markStatusError,
        primaryButtonProps: {
          text: 'Confirm and send to owner',
          onClick: requestMarkOutOfDate,
          ...this.getModalLoaderProps(isMarkingStatus)
        }
      }, {
        modalType: MODAL_TYPE.CONFIRM_UP_TO_DATE,
        title: 'Confirm Up-to-Date',
        description: 'Are you sure this card is now Up to Date?',
        error: markStatusError,
        primaryButtonProps: {
          text: 'Yes',
          onClick: requestMarkUpToDate,
          ...this.getModalLoaderProps(isMarkingStatus)
        }
      }, {
        modalType: MODAL_TYPE.CONFIRM_UP_TO_DATE_SAVE,
        title: 'Card Update',
        description: 'This card was originally not labeled as up to date. Would you like to mark it as Up to Date?',
        primaryButtonProps: {
          text: 'Yes',
          onClick: requestMarkUpToDate,
          ...this.getModalLoaderProps(isMarkingStatus)
        }
      }, {
        modalType: MODAL_TYPE.CONFIRM_APPROVE,
        title: 'Confirm Approval',
        description: 'Would you like to approve the changes to this card?',
        primaryButtonProps: {
          text: 'Yes',
          onClick: requestApproveCard,
          ...this.getModalLoaderProps(isMarkingStatus)
        }
      }, {
        modalType: MODAL_TYPE.ERROR_UPDATE,
        title: 'Update Error',
        description: `${updateError} Please try again.`,
        primaryButtonProps: {
          text: 'Ok',
          onClick: () => closeCardModal(MODAL_TYPE.ERROR_UPDATE)
        },
        showSecondary: false
      }, {
        modalType: MODAL_TYPE.ERROR_UPDATE_CLOSE,
        title: 'Update Error',
        description: `${updateError} Would you still like to close the card?`,
        primaryButtonProps: {
          text: 'Yes',
          onClick: () => closeCard(activeCardIndex)
        }
      }, {
        modalType: MODAL_TYPE.ERROR_DELETE,
        title: 'Deletion Error',
        description: `${deleteError} Please try again.`,
        primaryButtonProps: {
          text: 'Ok',
          onClick: () => closeCardModal(MODAL_TYPE.ERROR_DELETE),
        },
        showSecondary: false
      }, {
        modalType: MODAL_TYPE.CONFIRM_DELETE,
        title: 'Confirm Deletion',
        description: 'Deletion is permanent. All information will be lost upon closing. Are you sure you want to delete this card?',
        primaryButtonProps: {
          text: 'Delete',
          onClick: () => requestDeleteCard(activeCardIndex),
          ...this.getModalLoaderProps(isDeletingCard)
        }
      }, {
        modalType: MODAL_TYPE.CONFIRM_CLOSE_EDIT,
        title: 'Confirm Go Back',
        description: 'You have unsaved changes on this card. Would you like to save them?',
        primaryButtonProps: {
          text: 'Save',
          onClick: () => requestUpdateCard({ closeCard: false }),
          ...this.getModalLoaderProps(isUpdatingCard)
        },
        secondaryButtonProps: {
          text: 'No',
          onClick: this.confirmCloseEditModalSecondary,
        }
      }
    ];


    return (
      <React.Fragment>
        { MODALS.map(({ modalType, canClose=true, ...rest }) => (
          <CardConfirmModal
            key={modalType}
            isOpen={modalOpen[modalType]}
            onRequestClose={canClose ? () => closeCardModal(modalType) : null}
            {...rest}
          />
        ))}
      </React.Fragment>
    );
  }

  render() {
    const {
      hasLoaded, isGettingCard, getError,
      isEditing, tags, sideDockOpen, closeCardModal, modalOpen, openCardSideDock, closeCardSideDock, status
    } = this.props;

    if (!hasLoaded && getError) {
      const { message, status } = getError;
      const isUnauthorized = status === HTTP_STATUS_CODE.UNAUTHORIZED;

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
          { !isUnauthorized && status !== HTTP_STATUS_CODE.NOT_FOUND &&
            <Button
              color="primary"
              text="Reload Card"
              onClick={this.loadCard}
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
          { this.renderHeader() }
          { this.renderAnswer() }
          { this.renderModals() }
        </div>
        { this.renderFooter() }
        <CardSideDock />
        <CardCreateModal />
      </div>
    );
  }
}

export default connect(
  state => ({
    user: state.profile.user,

    ...state.cards.activeCard,
    cardsHeight: state.cards.cardsHeight,
    cardsWidth: state.cards.cardsWidth,
    activeCardIndex: state.cards.activeCardIndex,
  }),
  dispatch => bindActionCreators({
    ...cardActions,
  }, dispatch)
)(CardContent);

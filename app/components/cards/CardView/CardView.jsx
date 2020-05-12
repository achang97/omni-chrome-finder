import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { MdError, MdLock, MdAttachment } from 'react-icons/md';
import { FaSlack } from 'react-icons/fa';
import { Resizable } from 're-resizable';
import { EditorState } from 'draft-js';

import TextEditor from 'components/editors/TextEditor';
import { Button, Loader, Tooltip } from 'components/common';
import { ScreenRecordButton, AttachmentDropzone } from 'components/attachments';

import { generateFileKey, isAnyLoading } from 'utils/file';
import { getStyleApplicationFn } from 'utils/style';
import { CARD, REQUEST } from 'appConstants';

import SlackIcon from 'assets/images/icons/Slack_Mark.svg';

import style from './card-view.css';

import CardSideDock from './CardSideDock';
import CardCreateModal from './CardCreateModal';
import CardConfirmModals from './CardConfirmModals';
import CardHeader from './CardHeader';
import CardFooter from './CardFooter';

const s = getStyleApplicationFn(style);

const CardView = ({
  _id,
  question,
  descriptionEditorState,
  answerEditorState,
  status,
  attachments,
  slackThreadConvoPairs,
  slackReplies,
  isEditing,
  edits,
  editorEnabled,
  descriptionSectionHeight,
  hasLoaded,
  isGettingCard,
  getError,
  cardsHeight,
  enableCardEditor,
  adjustCardDescriptionSectionHeight,
  openCardModal,
  updateCardQuestion,
  updateCardDescriptionEditor,
  updateCardAnswerEditor,
  requestGetCard,
  openCardSideDock,
  requestAddCardAttachment
}) => {
  const footerRef = useRef(null);
  const questionRef = useRef(null);

  const [showQuestionTooltip, setShowQuestionTooltip] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    if (
      hasLoaded &&
      status === CARD.STATUS.NOT_DOCUMENTED &&
      slackThreadConvoPairs.length !== 0 &&
      slackReplies.length === 0
    ) {
      openCardModal(CARD.MODAL_TYPE.SELECT_THREAD);
    }
  }, [hasLoaded]);

  useEffect(() => {
    if (!hasLoaded && !isGettingCard) {
      requestGetCard();
    }
  }, [_id]);

  useEffect(() => {
    const questionElem = questionRef.current;
    if (questionElem) {
      setShowQuestionTooltip(questionElem.scrollHeight > questionElem.clientHeight);
    }
  }, [question]);

  const getMaxDescriptionHeight = () => {
    const footerHeight = footerRef.current ? footerRef.current.clientHeight : 0;
    return (
      cardsHeight - CARD.DIMENSIONS.TABS_HEIGHT - footerHeight - CARD.DIMENSIONS.MIN_ANSWER_HEIGHT
    );
  };

  const enableDescriptionEditor = () => {
    enableCardEditor(CARD.EDITOR_TYPE.DESCRIPTION);
    adjustCardDescriptionSectionHeight(getMaxDescriptionHeight());
  };

  const enableAnswerEditor = () => {
    enableCardEditor(CARD.EDITOR_TYPE.ANSWER);
    adjustCardDescriptionSectionHeight(CARD.DIMENSIONS.MIN_QUESTION_HEIGHT);
  };

  const getTextEditorProps = (editorRole) => {
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
    return descriptionEditorState.getCurrentContent().hasText();
  };

  const addCardAttachments = (files, cardId) => {
    files.forEach((file) => {
      requestAddCardAttachment(cardId || _id, generateFileKey(), file);
    });
  };

  const renderAdvancedSettings = () => {
    if (!isEditing) {
      return null;
    }

    const editAttachments = edits.attachments;
    return isEditing ? (
      <div className={s('card-content-spacing flex justify-between')}>
        {editAttachments.length !== 0 && (
          <div className={s('flex items-center')}>
            <div
              className={s(
                'flex text-purple-reg text-sm cursor-pointer underline-border border-purple-gray-20 items-center'
              )}
              onClick={openCardSideDock}
            >
              {isAnyLoading(editAttachments) ? (
                <Loader size="sm" className={s('mr-sm')} />
              ) : (
                <MdAttachment className={s('mr-sm')} />
              )}
              <div>
                {editAttachments.length} Attachment{editAttachments.length !== 0 && 's'}
              </div>
            </div>
          </div>
        )}
        <div className={s('flex ml-auto')}>
          <ScreenRecordButton
            id={_id}
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
        </div>
      </div>
    );
  };

  const renderQuestion = (showDescription) => (
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
            className={s(`text-2xl line-clamp-2 font-semibold ${!showDescription ? 'mb-lg' : ''}`)}
            ref={questionRef}
          >
            {question}
          </div>
        </Tooltip>
      )}
    </div>
  );

  const renderDescription = (showDescription) => {
    return (
      showDescription && (
        <div className={s('flex-grow min-h-0 flex flex-col min-h-0')}>
          {renderTextEditor(CARD.EDITOR_TYPE.DESCRIPTION)}
        </div>
      )
    );
  };

  const renderHeader = () => {
    const showDescription = hasDescription() || isEditing;
    const maxDescriptionHeight = getMaxDescriptionHeight();

    return (
      <Resizable
        minHeight={showDescription ? CARD.DIMENSIONS.MIN_QUESTION_HEIGHT : 'none'}
        size={{ height: showDescription ? descriptionSectionHeight : 'auto' }}
        className={s('bg-purple-light py-sm min-h-0 flex-shrink-0 flex flex-col')}
        maxHeight={maxDescriptionHeight}
        onResizeStop={(e, direction, ref, d) => {
          adjustCardDescriptionSectionHeight(descriptionSectionHeight + d.height);
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
        <CardHeader setToastMessage={setToastMessage} />
        {renderQuestion(showDescription)}
        {renderDescription(showDescription)}
        {renderAdvancedSettings()}
      </Resizable>
    );
  };

  const renderAnswer = () => {
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
              onClick={() => openCardModal(CARD.MODAL_TYPE.THREAD)}
              iconLeft={false}
              underline
            />
          </div>
        )}
        {!isEditing && slackReplies.length !== 0 && (
          <Button
            text="Thread"
            onClick={() => openCardModal(CARD.MODAL_TYPE.THREAD)}
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

  const renderErrorView = () => {
    const { message, status: errorStatus } = getError;
    const isUnauthorized = errorStatus === REQUEST.HTTP_STATUS_CODE.UNAUTHORIZED;

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
        {!isUnauthorized && errorStatus !== REQUEST.HTTP_STATUS_CODE.NOT_FOUND && (
          <Button color="primary" text="Reload Card" onClick={requestGetCard} />
        )}
      </div>
    );
  };

  const render = () => {
    if (!hasLoaded && getError) {
      return renderErrorView();
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
        <CardFooter
          toastMessage={toastMessage}
          onToastHide={() => setToastMessage(null)}
          ref={footerRef}
        />
        <CardSideDock />
        <CardCreateModal />
        <CardConfirmModals />
      </div>
    );
  };

  return render();
};

CardView.propTypes = {
  // Redux State
  _id: PropTypes.string.isRequired,
  question: PropTypes.string.isRequired,
  descriptionEditorState: PropTypes.instanceOf(EditorState).isRequired,
  answerEditorState: PropTypes.instanceOf(EditorState).isRequired,
  status: PropTypes.oneOf(Object.values(CARD.STATUS)).isRequired,
  attachments: PropTypes.arrayOf(PropTypes.object).isRequired,
  slackThreadConvoPairs: PropTypes.arrayOf(PropTypes.object).isRequired,
  slackReplies: PropTypes.arrayOf(PropTypes.object).isRequired,
  isEditing: PropTypes.bool.isRequired,
  edits: PropTypes.shape({
    question: PropTypes.string,
    answerEditorState: PropTypes.instanceOf(EditorState),
    descriptionEditorState: PropTypes.instanceOf(EditorState),
    attachments: PropTypes.arrayOf(PropTypes.object),
    slackReplies: PropTypes.arrayOf(PropTypes.object)
  }).isRequired,
  editorEnabled: PropTypes.objectOf(PropTypes.bool).isRequired,
  descriptionSectionHeight: PropTypes.number.isRequired,
  hasLoaded: PropTypes.bool.isRequired,
  isGettingCard: PropTypes.bool,
  getError: PropTypes.string,
  cardsHeight: PropTypes.number.isRequired,

  // Redux Actions
  enableCardEditor: PropTypes.func.isRequired,
  adjustCardDescriptionSectionHeight: PropTypes.func.isRequired,
  openCardModal: PropTypes.func.isRequired,
  updateCardQuestion: PropTypes.func.isRequired,
  updateCardDescriptionEditor: PropTypes.func.isRequired,
  updateCardAnswerEditor: PropTypes.func.isRequired,
  requestGetCard: PropTypes.func.isRequired,
  openCardSideDock: PropTypes.func.isRequired,
  requestAddCardAttachment: PropTypes.func.isRequired
};

export default CardView;

import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { MdError, MdLock, MdAttachment, MdOpenInNew } from 'react-icons/md';
import { FaSlack } from 'react-icons/fa';
import { EditorState } from 'draft-js';

import TextEditor from 'components/editors/TextEditor';
import { Button, Loader, Tooltip } from 'components/common';
import { ScreenRecordButton, AttachmentDropzone } from 'components/attachments';

import { generateFileKey, isAnyLoading } from 'utils/file';
import { getStyleApplicationFn } from 'utils/style';
import { CARD, REQUEST } from 'appConstants';

import SlackIcon from 'assets/images/icons/Slack_Mark.svg';

import style from './card-content.css';

import CardSideDock from '../CardSideDock';
import CardCreateModal from '../CardCreateModal';
import CardFinderModal from '../CardFinderModal';
import CardConfirmModals from '../CardConfirmModals';
import CardHeader from '../CardHeader';
import CardFooter from '../CardFooter';

const s = getStyleApplicationFn(style);

const CardContent = ({
  _id,
  question,
  answerEditorState,
  status,
  attachments,
  slackThreadConvoPairs,
  slackReplies,
  externalLinkAnswer,
  isEditing,
  edits,
  hasLoaded,
  isGettingCard,
  getError,
  openCardModal,
  updateCardQuestion,
  updateCardAnswerEditor,
  requestGetCard,
  openCardSideDock,
  requestAddCardAttachment
}) => {
  const questionRef = useRef(null);

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
      // setShowMoreButton(questionElem.scrollHeight > questionElem.clientHeight);
    }
  }, [question]);

  const getTextEditorProps = () => {
    const defaultProps = {
      toolbarHidden: true,
      readOnly: true,
      editorState: answerEditorState,
      onEditorStateChange: updateCardAnswerEditor
    };

    if (!isEditing) {
      return {
        ...defaultProps,
        wrapperClassName: 'rounded-0',
        editorClassName: 'card-text-editor-view card-text-editor-view-spacing'
      };
    }

    // Add editing props
    return {
      ...defaultProps,
      placeholder: 'Add an answer here',
      editorState: edits.answerEditorState,
      editorClassName: 'card-text-editor-view bg-white',
      toolbarHidden: false,
      readOnly: false,
      wrapperClassName: 'card-text-editor-wrapper-inactive light-gradient'
    };
  };

  const renderTextEditor = () => {
    const {
      className = '',
      wrapperClassName = '',
      editorClassName = '',
      onClick,
      ...rest
    } = getTextEditorProps();
    return (
      <TextEditor
        className={s(className)}
        onClick={() => onClick && onClick()}
        wrapperClassName={s(`flex flex-col flex-grow min-h-0 ${wrapperClassName}`)}
        editorClassName={s(`overflow-auto ${editorClassName}`)}
        toolbarClassName={s('border-t-0 border-l-0 border-r-0')}
        autoFocus
        {...rest}
      />
    );
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
      <div className={s('card-content-spacing flex justify-between mt-sm')}>
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

  const renderQuestion = () => (
    <div className={s('card-content-spacing mt-xs')}>
      {isEditing ? (
        <input
          placeholder="Title or Question"
          className={s('w-full')}
          value={edits.question}
          onChange={(e) => updateCardQuestion(e.target.value)}
        />
      ) : (
        <div className={s('text-2xl line-clamp-2 font-semibold')} ref={questionRef}>
          {question}
        </div>
      )}
    </div>
  );

  const renderHeader = () => {
    return (
      <div
        className={s('card-header-container bg-white py-sm min-h-0 flex-shrink-0 flex flex-col')}
      >
        <CardHeader setToastMessage={setToastMessage} />
        {renderQuestion()}
        {renderAdvancedSettings()}
      </div>
    );
  };

  const renderAnswer = () => {
    if (externalLinkAnswer) {
      return (
        <div className={s('flex-1 relative')}>
          <Loader className={s('card-answer-iframe-loader')} />
          <a href={externalLinkAnswer.link} target="_blank" rel="noopener noreferrer">
            <div
              className={s('absolute top-0 right-0 z-10 m-lg rounded-lg p-sm bg-purple-gray-10')}
            >
              <MdOpenInNew className={s('text-purple-reg')} />
            </div>
          </a>
          <iframe
            title={question}
            src={externalLinkAnswer.previewLink}
            className={s('w-full h-full border-0')}
          />
        </div>
      );
    }

    return (
      <div className={s('flex-grow min-h-0 flex flex-col min-h-0 relative')}>
        <div className={s('flex-grow min-h-0 flex flex-col min-h-0 pt-xs')}>
          {renderTextEditor()}
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
      <div className={s('flex flex-col h-full justify-center items-center bg-purple-2xlight')}>
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
        <div className={s('flex flex-col h-full justify-center bg-purple-2xlight')}>
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
        <CardFooter toastMessage={toastMessage} onToastHide={() => setToastMessage(null)} />
        <CardSideDock />
        <CardFinderModal />
        <CardCreateModal />
        <CardConfirmModals />
      </div>
    );
  };

  return render();
};

CardContent.propTypes = {
  // Redux State
  _id: PropTypes.string.isRequired,
  question: PropTypes.string.isRequired,
  answerEditorState: PropTypes.instanceOf(EditorState).isRequired,
  status: PropTypes.oneOf(Object.values(CARD.STATUS)).isRequired,
  attachments: PropTypes.arrayOf(PropTypes.object).isRequired,
  slackThreadConvoPairs: PropTypes.arrayOf(PropTypes.object).isRequired,
  slackReplies: PropTypes.arrayOf(PropTypes.object).isRequired,
  externalLinkAnswer: PropTypes.shape({
    link: PropTypes.string.isRequired,
    previewLink: PropTypes.string.isRequired
  }),
  isEditing: PropTypes.bool.isRequired,
  edits: PropTypes.shape({
    question: PropTypes.string,
    answerEditorState: PropTypes.instanceOf(EditorState),
    attachments: PropTypes.arrayOf(PropTypes.object),
    slackReplies: PropTypes.arrayOf(PropTypes.object)
  }).isRequired,
  hasLoaded: PropTypes.bool.isRequired,
  isGettingCard: PropTypes.bool,
  getError: PropTypes.string,

  // Redux Actions
  openCardModal: PropTypes.func.isRequired,
  updateCardQuestion: PropTypes.func.isRequired,
  updateCardAnswerEditor: PropTypes.func.isRequired,
  requestGetCard: PropTypes.func.isRequired,
  openCardSideDock: PropTypes.func.isRequired,
  requestAddCardAttachment: PropTypes.func.isRequired
};

export default CardContent;

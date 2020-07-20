import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { MdError, MdLock, MdAttachment, MdOpenInNew } from 'react-icons/md';
import { FaSlack } from 'react-icons/fa';

import TextEditor from 'components/editors/TextEditor';
import { Button, Loader, Tooltip } from 'components/common';
import { ScreenRecordButton, AttachmentDropzone } from 'components/attachments';

import { generateFileKey, isAnyLoading } from 'utils/file';
import { getStyleApplicationFn } from 'utils/style';
import { CARD, REQUEST, INTEGRATIONS, INTEGRATIONS_MAP } from 'appConstants';

import SlackIcon from 'assets/images/icons/Slack_Mark.svg';

import style from './card-content.css';

import CardSideDock from '../CardSideDock';
import CardCreateModal from '../CardCreateModal';
import CardFinderModal from '../CardFinderModal';
import CardApproversModal from '../CardApproversModal';
import CardConfirmModals from '../CardConfirmModals';
import CardSlackModals from '../CardSlackModals';
import CardHeader from '../CardHeader';
import CardFooter from '../CardFooter';

const s = getStyleApplicationFn(style);

const CardContent = ({
  _id,
  question,
  answerModel,
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
  updateCardAnswer,
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
  }, [hasLoaded, status, slackThreadConvoPairs.length, slackReplies.length, openCardModal]);

  useEffect(() => {
    if (!hasLoaded && !isGettingCard && !getError) {
      requestGetCard();
    }
  }, [_id, hasLoaded, getError, isGettingCard, requestGetCard]);

  useEffect(() => {
    const questionElem = questionRef.current;
    if (questionElem) {
      // setShowMoreButton(questionElem.scrollHeight > questionElem.clientHeight);
    }
  }, [question]);

  const renderTextEditor = () => {
    let textEditorProps;
    if (!isEditing) {
      textEditorProps = {
        model: answerModel,
        readOnly: true
      };
    } else {
      textEditorProps = {
        placeholder: 'Add an answer here',
        model: edits.answerModel,
        onModelChange: updateCardAnswer,
        readOnly: false
      };
    }

    return <TextEditor {...textEditorProps} />;
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
          placeholder="Add a title or question"
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
    const showIframe = externalLinkAnswer && externalLinkAnswer.type === INTEGRATIONS.GOOGLE.type;

    if (externalLinkAnswer && showIframe) {
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

    if (externalLinkAnswer && !showIframe) {
      return (
        <div className={s('py-xl px-lg')}>
          <a href={externalLinkAnswer.link} target="_blank" rel="noopener noreferrer">
            <div
              className={s(
                'rounded-lg bg-purple-gray-10 text-purple-reg shadow-md flex items-center p-reg'
              )}
            >
              <img
                src={INTEGRATIONS_MAP[externalLinkAnswer.type].logo}
                alt={externalLinkAnswer.type}
                className={s('h-xl w-xl')}
              />
              <div className={s('truncate mx-sm text-sm underline-border')}>{question}</div>
              <MdOpenInNew className={s('ml-auto')} />
            </div>
          </a>
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
      <div
        className={s(
          'flex flex-col h-full justify-center items-center bg-purple-2xlight rounded-b-lg'
        )}
      >
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
        <div className={s('flex flex-col h-full justify-center bg-purple-2xlight rounded-b-lg')}>
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
        <CardSlackModals />
        <CardApproversModal />
      </div>
    );
  };

  return render();
};

CardContent.propTypes = {
  // Redux State
  _id: PropTypes.string.isRequired,
  question: PropTypes.string.isRequired,
  answerModel: PropTypes.string.isRequired,
  status: PropTypes.oneOf(Object.values(CARD.STATUS)).isRequired,
  attachments: PropTypes.arrayOf(PropTypes.object).isRequired,
  slackThreadConvoPairs: PropTypes.arrayOf(PropTypes.object).isRequired,
  slackReplies: PropTypes.arrayOf(PropTypes.object).isRequired,
  externalLinkAnswer: PropTypes.shape({
    type: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
    previewLink: PropTypes.string
  }),
  isEditing: PropTypes.bool.isRequired,
  edits: PropTypes.shape({
    question: PropTypes.string,
    answerModel: PropTypes.string,
    attachments: PropTypes.arrayOf(PropTypes.object),
    slackReplies: PropTypes.arrayOf(PropTypes.object)
  }).isRequired,
  hasLoaded: PropTypes.bool.isRequired,
  isGettingCard: PropTypes.bool,
  getError: PropTypes.string,

  // Redux Actions
  openCardModal: PropTypes.func.isRequired,
  updateCardQuestion: PropTypes.func.isRequired,
  updateCardAnswer: PropTypes.func.isRequired,
  requestGetCard: PropTypes.func.isRequired,
  openCardSideDock: PropTypes.func.isRequired,
  requestAddCardAttachment: PropTypes.func.isRequired
};

export default CardContent;

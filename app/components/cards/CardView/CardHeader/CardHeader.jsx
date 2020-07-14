import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { MdMoreHoriz, MdKeyboardArrowLeft, MdContentCopy, MdAttachFile } from 'react-icons/md';
import { IoIosShareAlt } from 'react-icons/io';
// import { FaRegFilePdf } from 'react-icons/fa';
// import html2pdf from 'html2pdf.js';
import { Timeago, Tooltip, Separator, PlaceholderImg } from 'components/common';

import { copyCardUrl, isApprover } from 'utils/card';
import { copyText } from 'utils/window';
import { getStyleApplicationFn } from 'utils/style';
import { UserPropTypes } from 'utils/propTypes';
import { CARD, SEGMENT } from 'appConstants';

import CardStatus from '../../CardStatus';

const s = getStyleApplicationFn();

// const PDF_WIDTH = 621.572904588;
// const HTML2PDF_OPTIONS = {
//   margin: 1,
//   pagebreak: { mode: 'avoid-all' },
//   image: { type: 'jpeg', quality: 1 },
//   html2canvas: { useCORS: true, letterRendering: true },
//   jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
// };

const CardHeader = ({
  setToastMessage,
  ownUserId,
  user,
  outOfDateReason,
  _id,
  answer,
  externalLink,
  question,
  isEditing,
  status,
  attachments,
  lastVerified,
  hasCardChanged,
  cancelEditCard,
  openCardModal,
  openCardSideDock,
  trackEvent
}) => {
  const goBackToView = () => {
    if (hasCardChanged) {
      openCardModal(CARD.MODAL_TYPE.CONFIRM_CLOSE_EDIT);
    } else {
      cancelEditCard();
    }
  };

  const renderHeaderButtons = () => {
    const headerButtons = [
      {
        Icon: MdAttachFile,
        label: attachments.length,
        tooltip: `View Attachments (${attachments.length})`,
        onClick: openCardSideDock,
        className: `py-xs px-sm rounded-full shadow-md ${
          attachments.length > 0 ? 'gold-gradient' : 'bg-purple-light'
        }`,
        isShown: !isEditing,
        event: SEGMENT.EVENT.CLICK_VIEW_ATTACHMENTS
      },
      // {
      //   Icon: FaRegFilePdf,
      //   tooltip: 'Export to PDF',
      //   onClick: () => {
      //     const frViews = document.getElementsByClassName('fr-view');
      //     if (frViews.length === 0) {
      //       setToastMessage('No content to export!');
      //     } else {
      //       setToastMessage('Exporting card to PDF!');
      //       const view = frViews[0];
      //       const options = {
      //         ...HTML2PDF_OPTIONS,
      //         html2canvas: {
      //           ...HTML2PDF_OPTIONS.html2canvas,
      //           y: windowPosition.y + window.scrollY,
      //           x: windowPosition.x + window.scrollX,
      //           scrollY: window.scrollY,
      //           scrollX: window.scrollX
      //         }
      //       };
      //       html2pdf()
      //         .set(options)
      //         .from(view)
      //         .then(() => { view.style.width = `${PDF_WIDTH}px` })
      //         .save(question)
      //         .then(() => { view.style.width = ''; });
      //     }
      //   },
      //   isShown: !isEditing && answerModel,
      //   event: SEGMENT.EVENT.EXPORT_CARD_PDF
      // },
      {
        Icon: MdContentCopy,
        toast: 'Copied answer to clipboard!',
        tooltip: 'Copy Answer',
        onClick: () => copyText(answer || externalLink),
        isShown: !isEditing,
        event: SEGMENT.EVENT.COPY_CARD_BODY
      },
      {
        Icon: IoIosShareAlt,
        toast: 'Copied link to clipboard!',
        tooltip: 'Share Card',
        iconClassName: 'text-lg',
        onClick: () => copyCardUrl(_id),
        isShown: !isEditing,
        event: SEGMENT.EVENT.SHARE_CARD
      },
      {
        Icon: MdMoreHoriz,
        label: 'More',
        tooltip: 'Advanced Settings',
        onClick: openCardSideDock,
        isShown: true,
        event: SEGMENT.EVENT.CLICK_CARD_MORE_MENU
      }
    ];

    const headerOnClick = (onClick, event, toast) => {
      if (toast) setToastMessage(toast);
      trackEvent(event, { 'Card ID': _id, Question: question, Status: status });
      onClick();
    };

    const filteredButtons = headerButtons.filter(({ isShown }) => isShown);
    return (
      <div className={s('flex items-center opacity-75')}>
        {filteredButtons.map(
          (
            { Icon, toast, event, label, tooltip, onClick, className = '', iconClassName = '' },
            i
          ) => (
            <React.Fragment key={tooltip}>
              <Tooltip show={!!tooltip} tooltip={tooltip} tooltipProps={{ place: 'left' }}>
                <button
                  onClick={() => headerOnClick(onClick, event, toast)}
                  className={s(`flex items-center ${className}`)}
                  type="button"
                >
                  {label && <div className={s('text-xs mr-xs')}> {label} </div>}
                  <Icon className={s(iconClassName)} />
                </button>
              </Tooltip>
              {i !== filteredButtons.length - 1 && (
                <Separator className={s('mx-xs self-stretch bg-purple-gray-10')} />
              )}
            </React.Fragment>
          )
        )}
      </div>
    );
  };

  const cardStatusOnClick = (prevStatus) => {
    switch (prevStatus) {
      case CARD.STATUS.OUT_OF_DATE:
      case CARD.STATUS.NEEDS_VERIFICATION:
      case CARD.STATUS.ARCHIVED: {
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

  const renderHeaderLabels = () => {
    return (
      <>
        {/* Case 1: Card is documented and in edit */}
        {isEditing && status !== CARD.STATUS.NOT_DOCUMENTED && (
          <div className={s('flex cursor-pointer font-bold opacity-75')} onClick={goBackToView}>
            <MdKeyboardArrowLeft className={s('text-gray-dark')} />
            <div className={s('underline text-purple-reg')}> Back </div>
          </div>
        )}
        {/* Case 2: Card is not yet documented */}
        {isEditing && status === CARD.STATUS.NOT_DOCUMENTED && (
          <div className={s('font-bold opacity-75')}> New Card </div>
        )}

        {/* Case 3: Card is documented and not in edit */}
        {!isEditing && (
          <div className={s('flex items-center')}>
            {lastVerified && lastVerified.user && (
              <div className={s('flex items-center text-gray-dark')}>
                <Tooltip
                  tooltip={`${lastVerified.user.firstname} ${lastVerified.user.lastname}`}
                  show
                >
                  <div>
                    <PlaceholderImg
                      src={lastVerified.user.profilePicture}
                      name={`${lastVerified.user.firstname} ${lastVerified.user.lastname}`}
                      className={s('h-xl w-xl rounded-full mr-sm text-xs')}
                    />
                  </div>
                </Tooltip>
                <div className={s('italic flex items-center')}>
                  <span className={s('opacity-75')}>Verified by&nbsp;</span>
                  <span className={s('opacity-75')}>
                    {lastVerified.user._id === ownUserId ? 'you' : `${lastVerified.user.firstname}`}
                  </span>
                  &nbsp;
                  <Timeago date={lastVerified.time} live={false} textTransform={_.lowerCase} />
                </div>
              </div>
            )}
            <Separator className={s('bg-purple-gray-10 mx-sm opacity-75')} />
            <CardStatus
              status={status}
              isActionable={status !== CARD.STATUS.NEEDS_APPROVAL || isApprover(user)}
              outOfDateReason={outOfDateReason}
              onDropdownOptionClick={cardStatusOnClick}
              className={s('text-gray-dark')}
            />
          </div>
        )}
      </>
    );
  };

  return (
    <div
      className={s(
        'card-content-spacing text-xs text-purple-reg pt-xs pb-sm flex items-center justify-between'
      )}
    >
      {renderHeaderLabels()}
      {renderHeaderButtons()}
    </div>
  );
};

const LastTimestampPropTypes = PropTypes.shape({
  user: PropTypes.object.isRequired,
  time: PropTypes.string.isRequired
});

CardHeader.propTypes = {
  setToastMessage: PropTypes.func.isRequired,

  // Redux State
  user: UserPropTypes.isRequired,
  outOfDateReason: PropTypes.shape({
    reason: PropTypes.string.isRequired,
    sender: PropTypes.object.isRequired,
    time: PropTypes.string.isRequired
  }),
  ownUserId: PropTypes.string.isRequired,
  _id: PropTypes.string.isRequired,
  answer: PropTypes.string,
  externalLink: PropTypes.string,
  question: PropTypes.string,
  isEditing: PropTypes.bool.isRequired,
  status: PropTypes.oneOf(Object.values(CARD.STATUS)).isRequired,
  attachments: PropTypes.arrayOf(PropTypes.object).isRequired,
  lastVerified: LastTimestampPropTypes,
  hasCardChanged: PropTypes.bool.isRequired,

  // Redux Actions
  cancelEditCard: PropTypes.func.isRequired,
  openCardModal: PropTypes.func.isRequired,
  openCardSideDock: PropTypes.func.isRequired,
  trackEvent: PropTypes.func.isRequired
};

export default CardHeader;

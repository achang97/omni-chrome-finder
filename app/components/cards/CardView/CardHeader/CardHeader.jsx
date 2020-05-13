import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { MdMoreHoriz, MdKeyboardArrowLeft, MdContentCopy, MdAttachFile } from 'react-icons/md';
import { IoIosShareAlt } from 'react-icons/io';
import { Timeago, Tooltip, Separator, PlaceholderImg } from 'components/common';

import { copyCardUrl, isApprover } from 'utils/card';
import { copyText } from 'utils/window';
import { getStyleApplicationFn } from 'utils/style';
import { UserPropTypes } from 'utils/propTypes';
import { MODAL_TYPE, STATUS } from 'appConstants/card';

import CardStatus from '../../CardStatus';

const s = getStyleApplicationFn();

const CardHeader = ({
  setToastMessage,
  ownUserId,
  user,
  tags,
  outOfDateReason,
  _id,
  answer,
  isEditing,
  status,
  attachments,
  lastVerified,
  hasCardChanged,
  cancelEditCard,
  openCardModal,
  openCardSideDock
}) => {
  const goBackToView = () => {
    if (hasCardChanged) {
      openCardModal(MODAL_TYPE.CONFIRM_CLOSE_EDIT);
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
        }`
      },
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
        iconClassName: 'text-lg',
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

    const filteredButtons = headerButtons.filter(({ showEdit }) => showEdit || !isEditing);
    return (
      <div className={s('flex items-center opacity-75')}>
        {filteredButtons.map(
          ({ Icon, toast, label, tooltip, onClick, className = '', iconClassName = '' }, i) => (
            <React.Fragment key={tooltip}>
              <Tooltip show={!!tooltip} tooltip={tooltip} tooltipProps={{ place: 'left' }}>
                <button
                  onClick={() => headerOnClick(onClick, toast)}
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
      case STATUS.OUT_OF_DATE:
      case STATUS.NEEDS_VERIFICATION: {
        openCardModal(MODAL_TYPE.CONFIRM_UP_TO_DATE);
        break;
      }
      case STATUS.UP_TO_DATE: {
        openCardModal(MODAL_TYPE.CONFIRM_OUT_OF_DATE);
        break;
      }
      case STATUS.NEEDS_APPROVAL: {
        openCardModal(MODAL_TYPE.CONFIRM_APPROVE);
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
        {isEditing && status !== STATUS.NOT_DOCUMENTED && (
          <div className={s('flex cursor-pointer font-bold opacity-75')} onClick={goBackToView}>
            <MdKeyboardArrowLeft className={s('text-gray-dark')} />
            <div className={s('underline text-purple-reg')}> Back to View </div>
          </div>
        )}
        {/* Case 2: Card is not yet documented */}
        {isEditing && status === STATUS.NOT_DOCUMENTED && (
          <div className={s('font-bold opacity-75')}> New Card </div>
        )}

        {/* Case 3: Card is documented and not in edit */}
        {!isEditing && (
          <div className={s('flex items-center')}>
            {lastVerified && lastVerified.user && (
              <div className={s('italic flex items-center text-gray-dark')}>
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
                <span className={s('opacity-75')}>Verified by&nbsp;</span>
                <span className={s('opacity-75')}>
                  {lastVerified.user._id === ownUserId ? 'you' : `${lastVerified.user.firstname}`}
                </span>
                &nbsp;
                <Timeago date={lastVerified.time} live={false} textTransform={_.lowerCase} />
              </div>
            )}
            <Separator className={s('bg-purple-gray-10 mx-sm opacity-75')} />
            <CardStatus
              status={status}
              isActionable={status !== STATUS.NEEDS_APPROVAL || isApprover(user, tags)}
              outOfDateReason={outOfDateReason}
              onDropdownOptionClick={cardStatusOnClick}
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
  tags: PropTypes.arrayOf(PropTypes.object).isRequired,
  outOfDateReason: PropTypes.shape({
    reason: PropTypes.string.isRequired,
    sender: PropTypes.object.isRequired,
    time: PropTypes.string.isRequired
  }),
  ownUserId: PropTypes.string.isRequired,
  _id: PropTypes.string.isRequired,
  answer: PropTypes.string,
  isEditing: PropTypes.bool.isRequired,
  status: PropTypes.oneOf(Object.values(STATUS)).isRequired,
  attachments: PropTypes.arrayOf(PropTypes.object).isRequired,
  lastVerified: LastTimestampPropTypes,
  hasCardChanged: PropTypes.bool.isRequired,

  // Redux Actions
  cancelEditCard: PropTypes.func.isRequired,
  openCardModal: PropTypes.func.isRequired,
  openCardSideDock: PropTypes.func.isRequired
};

export default CardHeader;

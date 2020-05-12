import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { MdMoreHoriz, MdKeyboardArrowLeft, MdContentCopy, MdAttachFile } from 'react-icons/md';
import { IoIosShareAlt } from 'react-icons/io';
import { Timeago, Tooltip, Separator } from 'components/common';

import { copyCardUrl } from 'utils/card';
import { copyText } from 'utils/window';
import { getStyleApplicationFn } from 'utils/style';
import { MODAL_TYPE, STATUS, STATUS_NAME } from 'appConstants/card';

const s = getStyleApplicationFn();

const CardHeader = ({
  setToastMessage,
  ownUserId,
  _id,
  answer,
  isEditing,
  status,
  attachments,
  lastEdited,
  lastVerified,
  createdAt,
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
        onClick: openCardSideDock
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

    const filteredButtons = headerButtons.filter(({ showEdit }) => showEdit || !isEditing);
    return (
      <div className={s('flex items-center')}>
        {filteredButtons.map(({ Icon, toast, label, tooltip, onClick, className = '' }, i) => (
          <>
            <Tooltip
              show={!!tooltip}
              tooltip={tooltip}
              tooltipProps={{ place: 'left' }}
              key={tooltip}
            >
              <button
                onClick={() => headerOnClick(onClick, toast)}
                className={s('flex items-center')}
                type="button"
              >
                {label && <div className={s('text-xs mr-xs')}> {label} </div>}
                <Icon className={s(className)} />
              </button>
            </Tooltip>
            {i !== filteredButtons.length - 1 && (
              <Separator className={s('mx-xs self-stretch bg-purple-gray-10')} />
            )}
          </>
        ))}
      </div>
    );
  };

  const renderHeaderLabels = () => {
    return (
      <>
        {/* Case 1: Card is documented and in edit */}
        {isEditing && status !== STATUS.NOT_DOCUMENTED && (
          <div className={s('flex cursor-pointer font-bold')} onClick={goBackToView}>
            <MdKeyboardArrowLeft className={s('text-gray-dark')} />
            <div className={s('underline text-purple-reg')}> Back to View </div>
          </div>
        )}
        {/* Case 2: Card is not yet documented */}
        {isEditing && status === STATUS.NOT_DOCUMENTED && (
          <div className={s('font-bold')}> New Card </div>
        )}

        {/* Case 3: Card is documented and not in edit */}
        {!isEditing && (
          <div className={s('flex')}>
            <Timeago
              date={lastEdited ? lastEdited.time : createdAt}
              live={false}
              className={s('font-bold')}
            />
            {lastVerified && lastVerified.user && (
              <div className={s('text-gray-light ml-sm italic')}>
                (Last verified by&nbsp;
                {lastVerified.user._id === ownUserId
                  ? 'you'
                  : `${lastVerified.user.firstname} ${lastVerified.user.lastname}`}
                &nbsp;
                <Timeago date={lastVerified.time} live={false} textTransform={_.lowerCase} />)
              </div>
            )}
            <Separator className={s('bg-purple-gray-10 mx-sm')} />
            <div className={s('font-bold')}> {STATUS_NAME[status]} </div>
          </div>
        )}
      </>
    );
  };

  return (
    <div
      className={s(
        'card-content-spacing text-xs text-purple-reg pt-xs pb-sm flex items-center justify-between opacity-75'
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
  ownUserId: PropTypes.string.isRequired,
  _id: PropTypes.string.isRequired,
  answer: PropTypes.string,
  isEditing: PropTypes.bool.isRequired,
  status: PropTypes.oneOf(Object.values(STATUS)).isRequired,
  attachments: PropTypes.arrayOf(PropTypes.object).isRequired,
  lastEdited: LastTimestampPropTypes,
  lastVerified: LastTimestampPropTypes,
  createdAt: PropTypes.string,
  hasCardChanged: PropTypes.bool.isRequired,

  // Redux Actions
  cancelEditCard: PropTypes.func.isRequired,
  openCardModal: PropTypes.func.isRequired,
  openCardSideDock: PropTypes.func.isRequired
};

export default CardHeader;

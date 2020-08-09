import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { MdCheck, MdRemoveCircle, MdArrowDropDown, MdArchive } from 'react-icons/md';
import { FaPencilAlt, FaUserCheck } from 'react-icons/fa';
import { IoMdAlert } from 'react-icons/io';

import { Dropdown, Timeago, Triangle } from 'components/common';
import { CARD } from 'appConstants';

import { colors } from 'styles/colors';
import { getStyleApplicationFn } from 'utils/style';
import style from './card-status.css';
import CardUser from '../CardUser';

const s = getStyleApplicationFn(style);

const getDisplayInfo = (status) => {
  switch (status) {
    case CARD.STATUS.UP_TO_DATE:
      return {
        Icon: MdCheck,
        bgColor: 'green-xlight',
        fontColor: 'green-reg'
      };
    case CARD.STATUS.OUT_OF_DATE:
      return {
        Icon: MdRemoveCircle,
        bgColor: 'red-500',
        fontColor: 'white'
      };
    case CARD.STATUS.NEEDS_VERIFICATION:
      return {
        Icon: IoMdAlert,
        bgColor: 'yellow-reg',
        fontColor: 'black'
      };
    case CARD.STATUS.NOT_DOCUMENTED:
      return {
        Icon: FaPencilAlt,
        bgColor: 'blue-200',
        fontColor: 'blue-500'
      };
    case CARD.STATUS.NEEDS_APPROVAL:
      return {
        Icon: FaUserCheck,
        bgColor: 'orange-200',
        fontColor: 'orange-500'
      };
    case CARD.STATUS.ARCHIVED:
      return {
        Icon: MdArchive,
        bgColor: 'purple-light',
        fontColor: 'purple-reg'
      };
    default:
      return {};
  }
};

const getDropdownInfo = (status) => {
  switch (status) {
    case CARD.STATUS.NEEDS_VERIFICATION:
    case CARD.STATUS.OUT_OF_DATE:
    case CARD.STATUS.ARCHIVED:
      return { label: 'Flag as up to date', Icon: MdCheck, fontColor: 'green-reg' };
    case CARD.STATUS.UP_TO_DATE:
      return { label: 'Flag as outdated', Icon: MdRemoveCircle, fontColor: 'red-500' };
    case CARD.STATUS.NEEDS_APPROVAL:
      return { label: 'Approve', Icon: MdCheck, fontColor: 'green-reg' };
    default:
      return {};
  }
};

const CardStatus = ({
  isActionable,
  status,
  className,
  onDropdownOptionClick,
  outOfDateReason
}) => {
  const { Icon, bgColor, fontColor } = getDisplayInfo(status);
  const {
    Icon: DropdownIcon,
    fontColor: dropdownFontColor,
    label: dropdownLabel
  } = getDropdownInfo(status);

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const onClick = () => {
    if (onDropdownOptionClick) {
      onDropdownOptionClick(status);
    }
    setDropdownOpen(false);
  };

  const shouldShowDropdown = dropdownOpen && isActionable;
  const dropdownDisabled = !isActionable || status === CARD.STATUS.NOT_DOCUMENTED;

  return (
    <div className={s('flex')} onClick={(e) => !dropdownDisabled && e.stopPropagation()}>
      <Dropdown
        isOpen={shouldShowDropdown}
        onToggle={setDropdownOpen}
        className={s(
          `card-status bg-${bgColor} ${shouldShowDropdown ? 'rounded-b-none' : ''} ${className}`
        )}
        toggler={
          <div className={s(`flex py-xs px-sm text-${fontColor}`)}>
            <Icon />
            <div className={s('ml-xs')}> {CARD.STATUS_NAME[status]} </div>
            {!dropdownDisabled && <MdArrowDropDown />}
          </div>
        }
        body={
          !dropdownDisabled ? (
            <div className={s('card-status-main-dropdown')} onClick={onClick}>
              <DropdownIcon className={s(`text-${dropdownFontColor}`)} />
              <div className={s('ml-xs')}> {dropdownLabel} </div>
            </div>
          ) : null
        }
        disabled={dropdownDisabled}
      />
      {status === CARD.STATUS.OUT_OF_DATE && outOfDateReason && (
        <Dropdown
          className={s('ml-sm flex')}
          togglerClassName={s('flex')}
          toggler={
            <button
              className={s('bg-red-200 py-xs px-sm text-red-500 rounded-lg text-xs font-bold')}
              type="button"
            >
              ?
            </button>
          }
          body={
            <div className={s('flex flex-col')}>
              <Triangle
                direction="up"
                color="white"
                outlineColor={colors.gray.light}
                outlineSize={1}
                size={7}
                className={s('self-end mt-xs mr-xs')}
              />
              <div className={s('card-status-reason-dropdown')}>
                <div
                  className={s(
                    `mb-reg text-sm ${!outOfDateReason.reason ? 'italic text-gray-light' : ''}`
                  )}
                >
                  {outOfDateReason.reason || 'No reason specified.'}
                </div>
                <div className={s('flex items-center text-xs')}>
                  {outOfDateReason.sender && (
                    <>
                      <CardUser user={outOfDateReason.sender} showName={false} size="sm" />
                      <div className={s('ml-sm')}> {outOfDateReason.sender.firstname} </div>
                      <div className={s('mx-xs')}> &#8226; </div>
                    </>
                  )}
                  <Timeago live={false} date={outOfDateReason.time} />
                </div>
              </div>
            </div>
          }
        />
      )}
    </div>
  );
};

CardStatus.propTypes = {
  status: PropTypes.oneOf(Object.values(CARD.STATUS)).isRequired,
  isActionable: PropTypes.bool,
  className: PropTypes.string,
  onDropdownOptionClick: PropTypes.func,
  outOfDateReason: PropTypes.shape({
    reason: PropTypes.string.isRequired,
    sender: PropTypes.object.isRequired,
    time: PropTypes.string.isRequired
  })
};

CardStatus.defaultProps = {
  isActionable: false,
  className: '',
  outOfDateReason: null
};

export default CardStatus;

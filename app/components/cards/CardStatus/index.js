import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { MdCheck, MdRemoveCircle, MdArrowDropDown } from 'react-icons/md';
import { FaPencilAlt, FaUserCheck } from 'react-icons/fa';
import { IoMdAlert } from 'react-icons/io';

import CardUser from '../CardUser';
import { Dropdown, Timeago } from 'components/common';
import { CARD, NOOP } from 'appConstants';

import { colors } from 'styles/colors';

import style from './card-status.css';
import { getStyleApplicationFn } from 'utils/style';

const s = getStyleApplicationFn(style);

const getDisplayInfo = (status) => {
  switch (status) {
    case CARD.STATUS.UP_TO_DATE:
      return { label: 'Up to date', Icon: MdCheck, bgColor: 'green-xlight', fontColor: 'green-reg' };
    case CARD.STATUS.OUT_OF_DATE:
      return { label: 'Out of date', Icon: MdRemoveCircle, bgColor: 'red-500', fontColor: 'white' };
    case CARD.STATUS.NEEDS_VERIFICATION:
      return { label: 'Needs Verification', Icon: IoMdAlert, bgColor: 'yellow-reg', fontColor: 'black' };
    case CARD.STATUS.NOT_DOCUMENTED:
      return { label: 'Not Documented', Icon: FaPencilAlt, bgColor: 'blue-200', fontColor: 'blue-500' };
    case CARD.STATUS.NEEDS_APPROVAL:
      return { label: 'Needs Approval', Icon: FaUserCheck, bgColor: 'orange-200', fontColor: 'orange-500' };
    default:
      return {};
  }
};

const getDropdownInfo = (status) => {
  switch (status) {
    case CARD.STATUS.NEEDS_VERIFICATION:
    case CARD.STATUS.OUT_OF_DATE:
      return { label: 'Flag as up to date', Icon: MdCheck, fontColor: 'green-reg' };
    case CARD.STATUS.UP_TO_DATE:
      return { label: 'Flag as outdated', Icon: MdRemoveCircle, fontColor: 'red-500' };
    case CARD.STATUS.NEEDS_APPROVAL:
      return { label: 'Approve Changes', Icon: MdCheck, fontColor: 'green-reg' };
    default:
      return {};
  }
}

const CardStatus = ({ isActionable, status, className, onDropdownOptionClick, outOfDateReason }) => {
  const { label, Icon, bgColor, fontColor } = getDisplayInfo(status);
  const { Icon: DropdownIcon, fontColor: dropdownFontColor, label: dropdownLabel } = getDropdownInfo(status);

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const onClick = () => {
    onDropdownOptionClick(status);
    setDropdownOpen(false);
  };

  const shouldShowDropdown = dropdownOpen && isActionable;
  const dropdownDisabled = !isActionable || status === CARD.STATUS.NOT_DOCUMENTED;

  return (
    <div onClick={e => !dropdownDisabled && e.stopPropagation()} className={s('flex')}>
      <Dropdown
        isOpen={shouldShowDropdown}
        onToggle={setDropdownOpen}
        className={s(`card-status bg-${bgColor} ${shouldShowDropdown ? 'rounded-b-none' : ''} ${className}`)}
        toggler={
          <div className={s(`flex p-sm text-${fontColor}`)}>
            <Icon />
            <div className={s('ml-xs')}> {label} </div>
            { !dropdownDisabled && <MdArrowDropDown /> }
          </div>
        }
        body={!dropdownDisabled ?
          <div
            className={s('card-status-main-dropdown')}
            onClick={onClick}
          >
            <DropdownIcon className={s(`text-${dropdownFontColor}`)} />
            <div className={s('ml-xs')}> {dropdownLabel} </div>
          </div> : 
          null
        }
        disabled={dropdownDisabled}
      />
      { (status === CARD.STATUS.OUT_OF_DATE && outOfDateReason) &&
        <Dropdown
          className={s('ml-sm flex')}
          togglerClassName={s('flex')}
          toggler={
            <button className={s('bg-red-200 p-sm text-red-500 rounded-lg text-xs font-bold')}>
              ?
            </button>
          }
          body={
            <div className={s('card-status-reason-dropdown')}>
              <div className={s(`mb-reg text-sm ${!outOfDateReason.reason ? 'italic text-gray-light' : ''}`)}> {outOfDateReason.reason || 'No reason specified.'} </div>
              <div className={s('flex items-center text-xs')}>
                <CardUser
                  img={outOfDateReason.sender.profilePicture}
                  name={`${outOfDateReason.sender.firstname} ${outOfDateReason.sender.lastname}`}
                  showName={false}
                  size="sm"
                />
                <div className={s('ml-sm')}> {outOfDateReason.sender.firstname} </div>
                <div className={s('mx-xs')}> &#8226; </div>
                <Timeago live={false} date={outOfDateReason.time} />
              </div>
            </div>
          }
        />
      }
    </div>
  );
};

CardStatus.propTypes = {
  status: PropTypes.oneOf([CARD.STATUS.UP_TO_DATE, CARD.STATUS.OUT_OF_DATE, CARD.STATUS.NEEDS_VERIFICATION, CARD.STATUS.NEEDS_APPROVAL, CARD.STATUS.NOT_DOCUMENTED]),
  isActionable: PropTypes.bool,
  className: PropTypes.string,
  onDropdownOptionClick: PropTypes.func,
  outOfDateReason: PropTypes.shape({
    reason: PropTypes.string.isRequired,
    sender: PropTypes.object.isRequired,
    time: PropTypes.string.isRequired,
  })
};

CardStatus.defaultProps = {
  isActionable: false,
  className: '',
  onDropdownOptionClick: NOOP,
};


export default CardStatus;

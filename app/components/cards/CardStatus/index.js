import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { MdCheck, MdRemoveCircle, MdArrowDropDown } from 'react-icons/md';
import { IoMdAlert } from 'react-icons/io';
import { CARD_STATUS, NOOP } from '../../../utils/constants';
import Dropdown from '../../common/Dropdown';
import CardUser from '../CardUsers/CardUser';
import Timeago from 'react-timeago';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { openCardModal } from '../../../actions/cards';

import { colors } from '../../../styles/colors';

import style from './card-status.css';
import { getStyleApplicationFn } from '../../../utils/style';

const s = getStyleApplicationFn(style);

const getDisplayInfo = (status) => {
  switch (status) {
    case CARD_STATUS.UP_TO_DATE:
      return { label: 'Up to date', dropdownLabel: 'Flag as up to date', Icon: MdCheck, bgColor: 'green-xlight', fontColor: colors.green.reg, dropdownFontColor: 'green-reg' };
    case CARD_STATUS.OUT_OF_DATE:
      return { label: 'Out of date', dropdownLabel: 'Flag as outdated', Icon: MdRemoveCircle, bgColor: 'red-500', fontColor: 'white', dropdownFontColor: 'red-500' };
    case CARD_STATUS.NEEDS_VERIFICATION:
      return { label: 'Needs Verification', Icon: IoMdAlert, bgColor: 'yellow-reg', fontColor: 'black' };
    default:
      return {};
  }
};

const CardStatus = ({ isActionable, status, className, onDropdownOptionClick, outOfDateReason }) => {
  if (![CARD_STATUS.UP_TO_DATE, CARD_STATUS.OUT_OF_DATE, CARD_STATUS.NEEDS_VERIFICATION].includes(status)) {
    return null;
  }

  const { label, Icon, bgColor, fontColor } = getDisplayInfo(status);

  const dropdownStatus = status === CARD_STATUS.UP_TO_DATE ? CARD_STATUS.OUT_OF_DATE : CARD_STATUS.UP_TO_DATE;
  const { Icon: DropdownIcon, dropdownFontColor, dropdownLabel, dropdownModalType } = getDisplayInfo(dropdownStatus);

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const onClick = () => {
    onDropdownOptionClick(dropdownStatus);
    setDropdownOpen(false);
  };

  const shouldShowDropdown = dropdownOpen && isActionable;

  return (
    <div onClick={e => e.stopPropagation()} className={s('flex')}>
      <Dropdown
        isOpen={shouldShowDropdown}
        onToggle={setDropdownOpen}
        className={s(`card-status bg-${bgColor} ${shouldShowDropdown ? 'rounded-b-none' : ''} ${className}`)}
        toggler={
          <div
            className={s('flex p-sm')}
            style={{ color: fontColor }}
          >
            <Icon />
            <div className={s('ml-xs')}> {label} </div>
            { isActionable && <MdArrowDropDown /> }
          </div>
        }
        body={
          <div
            className={s('bg-white rounded-b-lg p-sm flex items-center shadow-md button-hover')}
            onClick={onClick}
          >
            <DropdownIcon className={s(`text-${dropdownFontColor}`)} />
            <div className={s('ml-xs')}> {dropdownLabel} </div>
          </div>
        }
        disabled={!isActionable}
      />
      { (status === CARD_STATUS.OUT_OF_DATE && outOfDateReason) &&
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
              <div className={s('mb-reg text-sm')}> {outOfDateReason.reason} </div>
              <div className={s('flex items-center text-xs')}>
                <CardUser
                  img={outOfDateReason.sender.img}
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
  status: PropTypes.oneOf([CARD_STATUS.UP_TO_DATE, CARD_STATUS.OUT_OF_DATE, CARD_STATUS.NEEDS_VERIFICATION, CARD_STATUS.NEEDS_APPROVAL, CARD_STATUS.NOT_DOCUMENTED]),
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

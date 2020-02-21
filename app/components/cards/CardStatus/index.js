import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { MdCheck, MdRemoveCircle, MdArrowDropDown } from 'react-icons/md';
import { IoMdAlert } from 'react-icons/io'
import { CARD_STATUS, NOOP } from '../../../utils/constants';
import Dropdown from '../../common/Dropdown';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { openCardModal } from '../../../actions/cards';

import { colors } from '../../../styles/colors';

import style from './card-status.css';
import { getStyleApplicationFn } from '../../../utils/styleHelpers';
const s = getStyleApplicationFn(style);

const getDisplayInfo = (cardStatus) => {
  switch (cardStatus) {
    case CARD_STATUS.UP_TO_DATE:
      return { label: 'Up to date', dropdownLabel: 'Flag as up to date', Icon: MdCheck, bgColor: 'green-xlight', fontColor: colors.green.reg, dropdownFontColor: colors.green.reg }
    case CARD_STATUS.OUT_OF_DATE:
      return { label: 'Out of date', dropdownLabel: 'Flag as outdated', Icon: MdRemoveCircle, bgColor: 'red-500', fontColor: 'white', dropdownFontColor: 'red-500' }
    case CARD_STATUS.NEEDS_VERIFICATION:
      return { label: 'Needs Verification', Icon: IoMdAlert, bgColor: 'yellow-reg', fontColor: 'black' }
    default:
      return {};
  }
}

const CardStatus = ({ isActionable, cardStatus, className, onDropdownOptionClick }) => {
  const { label, Icon, bgColor, fontColor } = getDisplayInfo(cardStatus);

  const dropdownStatus = cardStatus === CARD_STATUS.UP_TO_DATE ? CARD_STATUS.OUT_OF_DATE : CARD_STATUS.UP_TO_DATE;
  const { Icon: DropdownIcon, dropdownFontColor, dropdownLabel, dropdownModalType } = getDisplayInfo(dropdownStatus);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  return (
    <div className={s(`card-status bg-${bgColor} ${dropdownOpen ? 'rounded-b-none' : ''} ${className}`)}>
      <div
        className={s(`flex p-sm ${isActionable ? 'button-hover' : ''}`)}
        style={{ color: fontColor }}
        onClick={isActionable ? () => setDropdownOpen(!dropdownOpen) : NOOP}
      >
        <Icon />
        <div className={s("ml-xs")}> {label} </div>
        { isActionable && <MdArrowDropDown /> }
      </div>
      <Dropdown isOpen={dropdownOpen}>
        <div
          className={s("bg-white rounded-b-lg p-sm flex items-center shadow-md button-hover")}
          onClick={() => onDropdownOptionClick(dropdownStatus)}
        >
          <DropdownIcon className={s(`text-${dropdownFontColor}`)} />
          <div className={s("ml-xs")}> {dropdownLabel} </div>
        </div>
      </Dropdown>
    </div>
  );
}

CardStatus.propTypes = {
  cardStatus: PropTypes.oneOf([CARD_STATUS.UP_TO_DATE , CARD_STATUS.OUT_OF_DATE, CARD_STATUS.NEEDS_VERIFICATION, CARD_STATUS.NEEDS_APPROVAL, CARD_STATUS.NOT_DOCUMENTED]),
  isActionable: PropTypes.bool,
  className: PropTypes.string,
  onDropdownOptionClick: PropTypes.func,
};

CardStatus.defaultProps = {
  isActionable: false,
  className: '',
  onDropdownOptionClick: NOOP,
};


export default CardStatus;
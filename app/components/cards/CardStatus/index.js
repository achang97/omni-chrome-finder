import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MdCheck, MdRemoveCircle, MdArrowDropDown } from 'react-icons/md';
import { IoMdAlert } from 'react-icons/io'
import { CARD_STATUS_OPTIONS } from '../../../utils/constants';
import { colors } from '../../../styles/colors';
import style from './card-status.css';
import { getStyleApplicationFn } from '../../../utils/styleHelpers';
const s = getStyleApplicationFn(style);

const getDisplayInfo = (cardStatus) => {
  switch (cardStatus) {
    case CARD_STATUS_OPTIONS.UP_TO_DATE:
      return { label: 'Up to date', Icon: MdCheck, bgColor: 'green-xlight', fontColor: colors.green.reg }
    case CARD_STATUS_OPTIONS.OUT_OF_DATE:
      return { label: 'Out of date', Icon: MdRemoveCircle, bgColor: 'red-500', fontColor: 'white' }
    case CARD_STATUS_OPTIONS.NEEDS_VERIFICATION:
      return { label: 'Needs Verification', Icon: IoMdAlert, bgColor: 'yellow-reg', fontColor: 'black' }
    default:
      return {};
  }
}
/*
const getDisplayInfo = (isUpToDate) => {
  return isUpToDate ?
    { label: 'Up to date', Icon: MdCheck, bgColor: 'green-xlight', fontColor: colors.green.reg } :
    { label: 'Out of date', Icon: MdRemoveCircle, bgColor: 'red-500', fontColor: 'white' };
}
*/
const CardStatus = ({ isActionable, cardStatus, className }) => {
  const { label, Icon, bgColor, fontColor } = getDisplayInfo(cardStatus);

  return (
    <div className={s(`card-status bg-${bgColor} ${className}`)}>
      <div className={s("flex")} style={{ color: fontColor }}>
        <Icon />
        <div className={s("ml-xs")}> {label} </div>
      </div>
      { isActionable && <MdArrowDropDown /> }
    </div>
  );
}

CardStatus.propTypes = {
  cardStatus: PropTypes.oneOf([CARD_STATUS_OPTIONS.UP_TO_DATE , CARD_STATUS_OPTIONS.OUT_OF_DATE, CARD_STATUS_OPTIONS.NEEDS_VERIFICATION, CARD_STATUS_OPTIONS.NEEDS_APPROVAL, CARD_STATUS_OPTIONS.NOT_DOCUMENTED]),
  isActionable: PropTypes.bool,
  className: PropTypes.string,
};

CardStatus.defaultProps = {
  isActionable: false,
  className: '',
};

export default CardStatus;
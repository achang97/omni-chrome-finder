import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MdCheck, MdRemoveCircle, MdArrowDropDown } from 'react-icons/md';

import { colors } from '../../../styles/colors';
import style from './card-status.css';
import { getStyleApplicationFn } from '../../../utils/styleHelpers';
const s = getStyleApplicationFn(style);

const getDisplayInfo = (isUpToDate) => {
  return isUpToDate ?
    { label: 'Up to date', Icon: MdCheck, bgColor: 'green-xlight', fontColor: colors.green.reg } :
    { label: 'Out of date', Icon: MdRemoveCircle, bgColor: 'red-500', fontColor: 'white' };
}

const CardStatus = ({ isActionable, isUpToDate, className }) => {
  const { label, Icon, bgColor, fontColor } = getDisplayInfo(isUpToDate);

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
  isUpToDate: PropTypes.bool.isRequired,
  isActionable: PropTypes.bool,
  className: PropTypes.string,
};

CardStatus.defaultProps = {
  isActionable: false,
  className: '',
};

export default CardStatus;
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MdCheck, MdRemoveCircle, MdArrowDropDown } from 'react-icons/md';

import { colors } from '../../../styles/colors';
import { getStyleApplicationFn } from '../../../utils/styleHelpers';
const s = getStyleApplicationFn();

const getDisplayInfo = (isUpToDate) => {
  return isUpToDate ?
    { label: 'Up to date', Icon: MdCheck, bgColor: 'green-xlight', fontColor: colors.green.reg } :
    { label: 'Out of date', Icon: MdRemoveCircle, bgColor: 'red-500', fontColor: 'white' };
}

const CardStatus = (props) => {
  const { isActionable, isUpToDate } = props;
  const { label, Icon, bgColor, fontColor } = getDisplayInfo(isUpToDate);

  return (
    <div className={s(`flex items-center justify-between p-sm bg-${bgColor} rounded-lg font-semibold text-xs`)}>
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
};

CardStatus.defaultProps = {
  isActionable: false,
};

export default CardStatus;
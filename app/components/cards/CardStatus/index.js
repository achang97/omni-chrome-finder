import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MdCheck, MdRemoveCircle, MdArrowDropDown } from 'react-icons/md';

import { colors } from '../../../styles/colors';
import { getStyleApplicationFn } from '../../../utils/styleHelpers';
const s = getStyleApplicationFn();

class CardStatus extends Component {
  getDisplayInfo = () => {
    const { isUpToDate } = this.props;
    return isUpToDate ?
      { label: 'Up to date', Icon: MdCheck, bgColor: 'green-xlight', fontColor: colors.green.reg } :
      { label: 'Out of date', Icon: MdRemoveCircle, bgColor: 'red-500', fontColor: 'white' };
  }

  render() {
    const { isActionable } = this.props;
    const { label, Icon, bgColor, fontColor } = this.getDisplayInfo();

    return (
      <div className={s(`flex items-center justify-between p-sm bg-${bgColor} rounded-lg font-semibold text-xs`)}>
        <div className={s("flex")}>
          <Icon color={fontColor} />
          <div className={s("ml-xs")} style={{ color: fontColor }}> {label} </div>
        </div>
        { isActionable && <MdArrowDropDown /> }
      </div>
    );
  }
}

CardStatus.propTypes = {
  isUpToDate: PropTypes.bool.isRequired,
  isActionable: PropTypes.bool,
};

CardStatus.defaultProps = {
  isActionable: false,
};

export default CardStatus;
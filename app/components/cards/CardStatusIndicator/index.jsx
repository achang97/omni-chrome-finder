import React from 'react';
import PropTypes from 'prop-types';
import { GoPrimitiveDot } from 'react-icons/go';

import { STATUS } from 'appConstants/card';
import { getStyleApplicationFn } from 'utils/style';

const s = getStyleApplicationFn();

const getStatusColor = (status) => {
  switch (status) {
    case STATUS.UP_TO_DATE:
      return 'text-green-reg';
    case STATUS.OUT_OF_DATE:
      return 'text-red-500';
    case STATUS.NEEDS_VERIFICATION:
      return 'text-yellow-reg';
    case STATUS.NOT_DOCUMENTED:
      return 'text-blue-500';
    case STATUS.NEEDS_APPROVAL:
      return 'text-orange-500';
    default:
      return {};
  }
};

const CardStatusIndicator = ({ status, className }) => (
  <GoPrimitiveDot className={s(`${getStatusColor(status)} ${className}`)} />
);

CardStatusIndicator.propTypes = {
  status: PropTypes.oneOf(Object.values(STATUS)).isRequired,
  className: PropTypes.string
};

CardStatusIndicator.defaultProps = {
  className: ''
};

export default CardStatusIndicator;

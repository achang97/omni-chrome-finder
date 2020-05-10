import React from 'react';
import PropTypes from 'prop-types';
import Timeago from 'react-timeago';

const TIMEAGO_FORMATTER = (textTransform) => {
  return (value, unit, suffix) => {
    let unitLabel = unit;

    if (unit === 'second' && value < 30) {
      return textTransform('Just now');
    }

    if (value !== 1) {
      unitLabel += 's';
    }

    return textTransform(`${value} ${unitLabel} ${suffix}`);
  };
};

const CustomTimeago = ({ textTransform, ...rest }) => (
  <Timeago formatter={TIMEAGO_FORMATTER(textTransform)} {...rest} />
);

CustomTimeago.propTypes = {
  textTransform: PropTypes.func
};

CustomTimeago.defaultProps = {
  textTransform: (time) => time
};

export default CustomTimeago;

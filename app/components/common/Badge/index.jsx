import React from 'react';
import PropTypes from 'prop-types';
import { getStyleApplicationFn } from 'utils/style';
import style from './badge.css';

const s = getStyleApplicationFn(style);

const Badge = ({ count, maxCount, showZero, className, size }) =>
  (count !== 0 || showZero) && (
    <div className={s(`badge badge-${size} ${className}`)}>
      {count <= maxCount ? count : `${maxCount}+`}
    </div>
  );

Badge.propTypes = {
  count: PropTypes.number.isRequired,
  size: PropTypes.oneOf(['sm', 'md']),
  maxCount: PropTypes.number,
  showZero: PropTypes.bool,
  className: PropTypes.string
};

Badge.defaultProps = {
  size: 'md',
  maxCount: 99,
  showZero: false,
  className: ''
};

export default Badge;

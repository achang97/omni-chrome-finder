import React from 'react';
import PropTypes from 'prop-types';
import { MdArrowBack } from 'react-icons/md';

import { getStyleApplicationFn } from 'utils/style';
import style from './back-button.css';

import CircleButton from '../CircleButton';

const s = getStyleApplicationFn(style);

const BackButton = ({ onClick, disabled, className, size }) => (
  <CircleButton
    buttonClassName={s(`back-button ${className}`)}
    onClick={onClick}
    disabled={disabled}
    content={<MdArrowBack />}
    size={size}
  />
);

BackButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  size: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.oneOf(['2xs', 'xs', 'sm', 'md', 'lg', 'auto'])
  ])
};

BackButton.defaultProps = {
  disabled: false,
  className: '',
  size: 'xs'
};

export default BackButton;

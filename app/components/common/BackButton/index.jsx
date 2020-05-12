import React from 'react';
import PropTypes from 'prop-types';
import { MdArrowBack } from 'react-icons/md';

import { getStyleApplicationFn } from 'utils/style';
import style from './back-button.css';

const s = getStyleApplicationFn(style);

const BackButton = ({ onClick, disabled, className }) => (
  <div
    className={s(`back-button ${className} ${disabled ? 'back-button-disabled' : ''}`)}
    onClick={() => !disabled && onClick()}
  >
    <MdArrowBack />
  </div>
);

BackButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  className: PropTypes.string
};

BackButton.defaultProps = {
  disabled: false,
  className: ''
};

export default BackButton;

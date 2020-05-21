import React from 'react';
import PropTypes from 'prop-types';

import { getStyleApplicationFn } from 'utils/style';
import style from './circle-button.css';

const s = getStyleApplicationFn(style);

const getButtonStyle = (size) => {
  switch (size) {
    case '2xs':
      return { height: '20px', width: '20px' };
    case 'xs':
      return { height: '25px', width: '25px' };
    case 'sm':
      return { height: '32px', width: '32px' };
    case 'md':
      return { height: '40px', width: '40px' };
    case 'lg':
      return { height: '48px', width: '48px' };
    default:
      return { height: size, width: size };
  }
};

const CircleButton = ({
  size,
  onClick,
  content,
  label,
  disabled,
  className,
  buttonClassName,
  labelClassName,
  ...rest
}) => (
  <div className={s(`circle-button-container ${className}`)} {...rest}>
    <div
      className={s(
        `circle-button ${disabled ? 'button-disabled' : 'button-hover'} ${buttonClassName}`
      )}
      onClick={() => onClick && !disabled && onClick()}
      style={getButtonStyle(size)}
    >
      {content}
    </div>
    {label && <div className={s(`circle-button-label ${labelClassName}`)}> {label} </div>}
  </div>
);

CircleButton.propTypes = {
  size: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.oneOf(['2xs', 'xs', 'sm', 'md', 'lg', 'auto'])
  ]),
  content: PropTypes.node.isRequired,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  label: PropTypes.string,
  className: PropTypes.string,
  buttonClassName: PropTypes.string,
  labelClassName: PropTypes.string
};

CircleButton.defaultProps = {
  size: 'md',
  label: null,
  disabled: false,
  onClick: null,
  className: '',
  buttonClassName: '',
  labelClassName: ''
};

export default CircleButton;

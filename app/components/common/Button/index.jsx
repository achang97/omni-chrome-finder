import React from 'react';
import PropTypes from 'prop-types';
import { getStyleApplicationFn } from 'utils/style';
import style from './button.css';

const s = getStyleApplicationFn(style);

const getClassNames = (color, underline) => {
  switch (color) {
    case 'primary':
      return {
        outerClassName: 'primary-gradient text-white',
        innerClassName: underline ? 'primary-underline' : ''
      };
    case 'secondary':
      return {
        outerClassName: `button-${color}`,
        innerClassName: underline ? `button-underline-${color}` : ''
      };
    case 'transparent':
      return {
        outerClassName: `light-gradient button-${color}`,
        innerClassName: underline ? `button-underline-${color}` : ''
      };
    case 'gold':
      return {
        outerClassName: `gold-gradient text-gold-reg`,
        innerClassName: underline ? `button-underline-${color}` : ''
      };
    default:
      return {};
  }
};

const Button = ({
  text,
  textClassName,
  icon,
  iconLeft,
  className,
  underline,
  underlineColor,
  color,
  onClick,
  disabled
}) => {
  const { outerClassName = '', innerClassName = '' } = getClassNames(color, underline);

  const protectedOnClick = () => {
    if (onClick && !disabled) onClick();
  };

  return (
    <div
      className={s(
        `button-container ${className} ${outerClassName} ${
          disabled ? 'cursor-not-allowed opacity-75' : 'button-hover'
        }`
      )}
      onClick={protectedOnClick}
    >
      {iconLeft && icon}
      {text && (
        <div
          className={s(
            `button-text ${
              underline && underlineColor ? `underline-border border-${underlineColor}` : ''
            } ${innerClassName} ${textClassName}`
          )}
        >
          {text}
        </div>
      )}
      {!iconLeft && icon}
    </div>
  );
};

Button.propTypes = {
  text: PropTypes.node,
  className: PropTypes.string,
  textClassName: PropTypes.string,
  underline: PropTypes.bool,
  underlineColor: PropTypes.string,
  onClick: PropTypes.func,
  icon: PropTypes.node,
  iconLeft: PropTypes.bool,
  color: PropTypes.oneOf(['primary', 'secondary', 'transparent', 'gold']),
  disabled: PropTypes.bool
};

Button.defaultProps = {
  text: null,
  className: '',
  textClassName: '',
  underline: true,
  underlineColor: null,
  onClick: null,
  icon: null,
  iconLeft: true,
  color: null,
  disabled: false
};

export default Button;

import React from 'react';
import PropTypes from 'prop-types';
import { getStyleApplicationFn } from 'utils/style';
import style from './button.css';

const s = getStyleApplicationFn(style);

const getButtonStyles = (color) => {
  let outerClassName = '';
  let innerClassName = '';
  let borderColor;

  switch (color) {
    case 'primary':
      outerClassName = 'primary-gradient text-white';
      innerClassName = 'primary-underline';
      break;
    case 'secondary':
      outerClassName = `bg-white text-purple-reg`;
      borderColor = '#777bad33';
      break;
    case 'transparent':
      outerClassName = `light-gradient text-purple-reg`;
      borderColor = '#777bad33';
      break;
    case 'gold':
      outerClassName = `gold-gradient text-gold-reg`;
      borderColor = '#b18b5033';
      break;
    case 'danger': {
      outerClassName = 'bg-red-100 text-red-500';
      innerClassName = `border-red-200`;
      break;
    }
    default:
      break;
  }

  return {
    outerClassName,
    innerClassName,
    innerStyle: { borderColor }
  };
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
  disabled,
  ...rest
}) => {
  const protectedOnClick = (e) => {
    if (onClick && !disabled) onClick(e);
  };

  const { outerClassName, innerClassName, innerStyle } = getButtonStyles(color);
  const underlineClassName = `
    underline-border
    ${underlineColor ? `border-${underlineColor}` : innerClassName}
  `;

  return (
    <div
      className={s(`
        button-container ${className} ${outerClassName}
        ${disabled ? 'button-disabled' : 'button-hover'}
      `)}
      onClick={protectedOnClick}
      {...rest}
    >
      {iconLeft && icon}
      {text && (
        <div
          className={s(`button-text ${textClassName} ${underline ? underlineClassName : ''}`)}
          style={!underlineColor ? innerStyle : {}}
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

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import style from './button.css';
import { getStyleApplicationFn } from '../../../utils/style';

const s = getStyleApplicationFn(style);

const getClassNames = (color, underline) => {
  switch (color) {
    case 'primary':
      return {
        outerClassName: 'primary-gradient text-white',
        innerClassName: underline ? 'primary-underline' : ''
      };
    case 'secondary':
    case 'transparent':
      return {
        outerClassName: `button-${color}`,
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

const Button = (props) => {
  const { text, containerClassName, textClassName, icon, iconLeft, className, underline, underlineColor, color, onClick, imgSrc, imgClassName, disabled, ...rest } = props;
  const { outerClassName = '', innerClassName = '' } = getClassNames(color, underline);

  const protectedOnClick = () => {
    if (onClick && !disabled) onClick();
  };

  return (
    <button onClick={protectedOnClick} {...rest} className={containerClassName}>
      <div className={s(`button-container ${className} ${outerClassName} ${disabled ? 'cursor-not-allowed opacity-75' : 'button-hover'}`)}>
        { iconLeft && icon }
        { iconLeft && imgSrc && <img className={s(`${imgClassName}`)} src={imgSrc} /> }
        <div className={s(`button-text ${underline && underlineColor ? `underline-border border-${underlineColor}` : ''} ${innerClassName} ${textClassName}`)}>
          {text}
        </div>
        { !iconLeft && icon }
        { !iconLeft && imgSrc && <img className={s(`${imgClassName}`)} src={imgSrc} /> }
      </div>      
    </button>
  );
};

Button.propTypes = {
  text: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  containerClassName: PropTypes.string,
  className: PropTypes.string,
  textClassName: PropTypes.string,
  imgClassName: PropTypes.string,
  underline: PropTypes.bool,
  underlineColor: PropTypes.string,
  onClick: PropTypes.func,
  icon: PropTypes.element,
  iconLeft: PropTypes.bool,
  color: PropTypes.oneOf(['primary', 'secondary', 'transparent', 'gold']),
  disabled: PropTypes.bool,
};


Button.defaultProps = {
  text: '',
  containerClassName: '',
  className: '',
  textClassName: '',
  imgClassName: '',
  underline: true,
  icon: null,
  iconLeft: true,
  imgSrc: null,
  disabled: false,
};

export default Button;

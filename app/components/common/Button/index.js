import React, { Component } from 'react';
import PropTypes from 'prop-types';
import style from './button.css';
import { getStyleApplicationFn } from '../../../utils/styleHelpers';
const s = getStyleApplicationFn(style);

const getClassNames = (color, underline) => {
	switch (color) {
		case 'primary':
			return {
				outerClassName: `primary-gradient text-white`,
				innerClassName: underline ? 'primary-underline' : ''
			}
		case 'secondary':
		case 'transparent':
			return {
				outerClassName: `button-${color}`,
				innerClassName: underline ? `button-underline-${color}` : ''
			}
		default:
			return {};
	}
}

const Button = (props) => {
	const { text, textClassName, icon, iconLeft, className, underline, underlineColor, color, onClick, imgSrc, imgClassName } = props;
	const { outerClassName = '', innerClassName = '' } = getClassNames(color, underline);

	const protectedOnClick = () => {
		if (onClick) onClick();
	}

	return (
		<div className={s(`button-container button-hover ${className} ${outerClassName}`)} onClick={protectedOnClick}>
			{ iconLeft && icon }
			{ iconLeft && imgSrc && <img className={s(`${imgClassName}`)} src={imgSrc} /> }
			<div className={s(`button-text ${underline && underlineColor ? `underline-border border-${underlineColor}` : ''} ${innerClassName} ${textClassName}`)}>
				{text}
			</div>
			{ !iconLeft && icon }
			{ !iconLeft && imgSrc && <img className={s(`${imgClassName}`)} src={imgSrc} /> }
		</div>
	);
}

Button.propTypes = {
	text: PropTypes.string,
	className: PropTypes.string,
	textClassName: PropTypes.string,
	imgClassName: PropTypes.string,
	underline: PropTypes.bool,
	underlineColor: PropTypes.string,
	onClick: PropTypes.func,
	icon: PropTypes.element,
	iconLeft: PropTypes.bool,
	color: PropTypes.oneOf(["primary", "secondary", "transparent"]),
}


Button.defaultProps = {
	text: '',
	className: '',
	textClassName: '',
	imgClassName: '',
	underline: true,
	icon: null,
	iconLeft: true,
	imgSrc: null,
}

export default Button;
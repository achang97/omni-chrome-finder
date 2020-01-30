import React, { Component } from 'react';
import PropTypes from 'prop-types';
import style from './button.css';
import { getStyleApplicationFn } from '../../../utils/styleHelpers';
const s = getStyleApplicationFn(style);


export default class Button extends Component {
	constructor(props) {
		super(props);
	}

	onClick = () => {
		if (this.props.onClick) this.props.onClick();
	}

	getClassNames = (color, underline) => {
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

	render() {
		const { text, textClassName, icon, iconLeft, className, underline, color } = this.props;
		const { outerClassName = '', innerClassName = '' } = this.getClassNames(color, underline);

		return (
			<div className={s(`${className} flex justify-center shadow-md button-container ${outerClassName}`)} onClick={() => this.onClick()}>
				{ iconLeft && icon }
				<div className={s(`button-text ${innerClassName} ${textClassName}`)}>{text}</div>
				{ !iconLeft && icon }
			</div>
		);
	}
}

Button.propTypes = {
	text: PropTypes.string,
	className: PropTypes.string,
	textClassName: PropTypes.string,
	underline: PropTypes.bool,
	onClick: PropTypes.func,
	icon: PropTypes.element,
	iconLeft: PropTypes.bool,
	color: PropTypes.oneOf(["primary", "secondary", "transparent"]),
}


Button.defaultProps = {
	text: '',
	className: '',
	textClassName: '',
	underline: true,
	icon: null,
	iconLeft: true,
	color: 'primary',
}
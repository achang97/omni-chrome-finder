import React, { Component } from 'react';
import PropTypes from 'prop-types';
import style from './button.css';
import { getStyleApplicationFn } from '../../../utils/styleHelpers';
const s = getStyleApplicationFn(style);


export default class Button extends Component {
	constructor(props) {
		super(props);
	}

	onClickButton = () => {
		if (this.props.onClickButton) this.props.onClickButton();
	}

	render() {
		const { text, textClassName, icon, buttonClassName, underline, color } = this.props;
		return (
			<div className={s(`${buttonClassName} flex justify-center button-container button-${color}`)} onClick={() => this.onClickButton()}>
				{ icon }
				<div className={s(`button-text ${underline ? `button-underline-${color}` : ''} ${textClassName}`)}>{text}</div>
			</div>
		);
	}
}

Button.propTypes = {
	text: PropTypes.string,
	buttonClassName: PropTypes.string,
	textClassName: PropTypes.string,
	underline: PropTypes.bool,
	onClickButton: PropTypes.func,
	icon: PropTypes.element,
	color: PropTypes.string,
}


Button.defaultProps = {
	text: '',
	buttonClassName: '',
	textClassName: '',
	underline: true,
	icon: null,
	color: 'primary',
}
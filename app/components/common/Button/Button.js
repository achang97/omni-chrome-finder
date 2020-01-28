import React, { Component } from 'react';
import PropTypes from 'prop-types';
import style from './button.css';
import { getStyleApplicationFn } from '../../../utils/styleHelpers';
const s = getStyleApplicationFn(style);


//const CLASSNAME_PROPS = ["tabContainerClassName", "rippleClassName", "tabClassName", "activeTabClassName", "inactiveTabClassName"];

class Button extends Component {
	constructor(props) {
		super(props);
	}

	onClickButton = () => {
		if (this.props.onClickButton) this.props.onClickButton();
	}

	render() {
		const { text, textClassName, icon, buttonClassName } = this.props;
		return (
			<div>
				<div className={s(` ${buttonClassName} flex button-container`)} onClick={() => this.onClickButton()}>
					{ icon }
					<div className={s(`button-text button-text-underline ${textClassName}`)}>{text}</div>
				</div>
				
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
}


Button.defaultProps = {
	text: '',
	buttonClassName: '',
	textClassName: '',
	underline: false,
	icon: null,
}

export default Button;
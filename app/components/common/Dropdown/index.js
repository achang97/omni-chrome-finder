import React, { Component } from 'react';
import PropTypes from 'prop-types';
import onClickOutside from "react-onclickoutside";

import { NOOP } from '../../../utils/constants';

import { getStyleApplicationFn } from '../../../utils/styleHelpers';
const s = getStyleApplicationFn();

const getPositionStyle = (isDown, isLeft) => {
	let style = { position: 'absolute', zIndex: 10 };

	if (isDown) {
		style.top = '100%';
	} else {
		style.bottom = '100%';
	}

	if (isLeft) {
		style.right = '0';
	} else {
		style.left = '0';
	}

	return style;
}

class Dropdown extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isOpen: false,
		}
	}

	handleClickOutside = evt => {
		const { onToggle } = this.props;

		if (onToggle) {
			onToggle(false);
		} else {
			this.setState({ isOpen: false });
		}
	};

	onToggleClick = () => {
		const { disabled, onToggle, isOpen } = this.props;

		if (onToggle) {
			onToggle(!isOpen);
		} else {
			this.setState({ isOpen: !this.state.isOpen })
		}
	}

	render() {
		const { isDown, isLeft, toggler, body, disabled, className, togglerClassName } = this.props;
		const isOpen = this.props.isOpen !== undefined ? this.props.isOpen : this.state.isOpen;

		const style = getPositionStyle(isDown, isLeft);

		return (
			<div className={s(`relative ${className}`)}>
				<div
					onClick={!disabled ? this.onToggleClick : NOOP}
					className={s(`${togglerClassName} ${!disabled ? 'button-hover' : ''}`)}
				>
					{toggler}
				</div>
				{ isOpen &&
					<div style={style}>
						{body}
					</div>
				}
			</div>
		);
	}
}

Dropdown.propTypes = {
	isDown: PropTypes.bool,
	isLeft: PropTypes.bool,
	toggler: PropTypes.element.isRequired,
	body: PropTypes.element.isRequired,
	isOpen: PropTypes.bool,
	onToggle: PropTypes.func,
	disabled: PropTypes.bool,
	className: PropTypes.string,
	togglerClassName: PropTypes.string,	
}

Dropdown.defaultProps = {
	isDown: true,
	isLeft: true,
	disabled: false,
	className: '',
	togglerClassName: '',
}

export default onClickOutside(Dropdown);
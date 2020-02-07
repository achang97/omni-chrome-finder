import React, { Component } from 'react';
import PropTypes from 'prop-types';

import onClickOutside from "react-onclickoutside";

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
	handleClickOutside = evt => {
		// ..handling code goes here...
		const { onClose } = this.props;
		if (onClose) onClose();
	};

	render() {
		const { isDown, isLeft, isOpen, onClose, children } = this.props;

		if (!isOpen) return null;

		const style = getPositionStyle(isDown, isLeft);
		return (
			<div style={style}>
				{children}
			</div>
		);
	}
}
	
Dropdown.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	onClose: PropTypes.func,
	isDown: PropTypes.bool,
	isLeft: PropTypes.bool,
}

Dropdown.defaultProps = {
	isDown: true,
	isLeft: true,
}

export default onClickOutside(Dropdown);
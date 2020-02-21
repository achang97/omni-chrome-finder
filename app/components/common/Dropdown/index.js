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
		const { onClose } = this.props;

		if (onClose) onClose();
	};

	render() {
		const { isDown, isLeft, isOpen, onClose, children, className } = this.props;

		if (!isOpen) return null;

		const style = getPositionStyle(isDown, isLeft);
		return (
			<div style={style} className={className}>
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
	className: PropTypes.string,
}

Dropdown.defaultProps = {
	isDown: true,
	isLeft: true,
	className: '',
}

export default onClickOutside(Dropdown);
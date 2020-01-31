import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { getStyleApplicationFn } from '../../../utils/styleHelpers';
const s = getStyleApplicationFn();

const CircleButton = ({ size, onClick, content, label, containerClassName, buttonClassName, labelClassName }) => {
	let buttonStyle;
	switch (size) {
		case 'sm':
			buttonStyle = { height: '32px', width: '32px' }
			break;
		case 'md':
			buttonStyle = { height: '40px', width: '40px' }
			break;
		case 'lg':
			buttonStyle = { height: '48px', width: '48px' }
			break;
		default:
			buttonStyle = { height: size, width: size }
			break;
	}

	return (
		<div className={s(`flex flex-col items-center ${containerClassName}`)}>
			<div
				className={s(`rounded-full button-hover overflow-hidden flex items-center justify-center shadow-md ${buttonClassName}`)}
				onClick={onClick}
				style={buttonStyle}
			>
				{ content }
			</div>
			{ label && <div className={s(`mt-sm ${labelClassName}`)}> {label} </div> }
		</div>
	);
}

CircleButton.propTypes = {
	size: PropTypes.oneOfType([
	    PropTypes.number,
	    PropTypes.oneOf(['sm', 'md', 'lg'])
	]),
	content: PropTypes.oneOfType([PropTypes.element, PropTypes.string]).isRequired,
	onClick: PropTypes.func,
	label: PropTypes.string,
	containerClassName: PropTypes.string,
	buttonClassName: PropTypes.string,
	labelClassName: PropTypes.string,
}

CircleButton.defaultProps = {
	size: 'md',
	containerClassName: '',
	buttonClassName: '',
	labelClassName: '',
}

export default CircleButton;
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import style from './checkbox.css';
import { getStyleApplicationFn } from '../../../utils/styleHelpers';
const s = getStyleApplicationFn(style);



const CheckBox = (props) => {
	const { className } = props;
	return (
		<div className={s(`checkbox-container rounded-full border-gray-checkbox-border flex flex-col items-center justify-center ${className}`)}>
			<div>Hi</div>
		</div>
	);
}

CheckBox.propTypes = {
	isSelected: PropTypes.bool,
	className: PropTypes.string,

}


CheckBox.defaultProps = {
	isSelected: false,
	className: ''
}

export default CheckBox;
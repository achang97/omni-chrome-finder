import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MdCheck } from 'react-icons/md';
import style from './checkbox.css';
import { getStyleApplicationFn } from '../../../utils/styleHelpers';
const s = getStyleApplicationFn(style);

const CheckBox = (props) => {
	const { className, isSelected, toggleCheckbox } = props;

	return (
		<div 
			className={s(`checkbox-container rounded-full text-purple-reg border-gray-checkbox-border flex flex-col items-center justify-center cursor-pointer ${isSelected ? 'bg-purple-checkbox border-0' : 'bg-white'} ${className}`)}
			onClick={toggleCheckbox} >
			{ isSelected && <MdCheck /> }
		</div>
	);
}

CheckBox.propTypes = {
	isSelected: PropTypes.bool.isRequired,
	toggleCheckbox: PropTypes.func,
	className: PropTypes.string.isRequired,

}


CheckBox.defaultProps = {
	isSelected: false,
	className: ''
}

export default CheckBox;
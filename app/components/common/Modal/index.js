import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { MdClose } from 'react-icons/md';

import style from './modal.css';
import { getStyleApplicationFn } from '../../../utils/styleHelpers';
const s = getStyleApplicationFn(style);

const Modal = ({ isOpen, onRequestClose, shouldCloseOnOutsideClick, className, headerClassName, bodyClassName, overlayClassName, title, children }) => {
	const onOutsideClick = () => {
		if (shouldCloseOnOutsideClick && onRequestClose) onRequestClose();
	}

	return (
		<div className={s(isOpen ? 'modal-show' : '')}>
			<div className={s(`modal ${className}`)}>
				<div className={s(`modal-header ${headerClassName}`)}>
					<div className={s("font-semibold")}> {title} </div>
					<button onClick={onRequestClose}> <MdClose className={s("text-purple-gray-50")} /> </button>
				</div>
				<div className={s(`modal-body ${bodyClassName}`)}>
					{children}
				</div>
			</div>
			<div className={s(`modal-overlay ${overlayClassName}`)} onClick={onOutsideClick} />
		</div>
	);
}

Modal.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	onRequestClose: PropTypes.func.isRequired,
	shouldCloseOnOutsideClick: PropTypes.bool,
	className: PropTypes.string,
	headerClassName: PropTypes.string,
	bodyClassName: PropTypes.string,
	overlayClassName: PropTypes.string,
	title: PropTypes.string,
}

Modal.defaultProps = {
	shouldCloseOnOutsideClick: false,
	overlayClassName: '',
	headerClassName: '',
	bodyClassName: '',
	className: '',
}

export default Modal;
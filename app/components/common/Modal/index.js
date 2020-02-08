import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Transition } from 'react-transition-group';

import { MdClose } from 'react-icons/md';

import style from './modal.css';
import { getStyleApplicationFn } from '../../../utils/styleHelpers';
const s = getStyleApplicationFn(style);



const Modal = ({ isOpen, transitionMs, className, onRequestClose, headerClassName, overlayClassName, bodyClassName, title, children }) => {
	const onOutsideClick = () => {
		if (shouldCloseOnOutsideClick && onRequestClose) onRequestClose();
	}

	const baseStyle = { transition: `opacity ${transitionMs}ms ease-in-out, transform ${transitionMs}ms` };

	const modalTransitionStyles = {
		entering: { opacity: 0, transform: 'translate(0, -50%) scale(0.5)' },
		entered:  { opacity: 1, transform: 'translate(0, -50%)', visibility: 'visible' },
		exiting:  { opacity: 1, transform: 'translate(0, -50%) scale(0.5)' },
		exited:  { opacity: 0, visibility: 'hidden' },
	};

	const overlayTransitionStyles = {
		entering: { opacity: 1 },
		entered:  { opacity: 1 },
		exiting:  { opacity: 0 },
		exited:  { opacity: 0 },
	};

	return (
		<div>
			<Transition
				in={isOpen}
				timeout={transitionMs}
				mountOnEnter
				unmountOnExit
			>
				{state => (
					<div style={{ ...baseStyle, ...modalTransitionStyles[state] }} className={s(`modal ${className}`)}>
						<div className={s(`modal-header ${headerClassName}`)}>
							<div className={s("font-semibold")}> {title} </div>
							<button onClick={onRequestClose}> <MdClose className={s("text-purple-gray-50")} /> </button>
						</div>
						<div className={s(`modal-body ${bodyClassName}`)}>
							{children}
						</div>
					</div>
				)}
			</Transition>
			<Transition
				in={isOpen}
				timeout={transitionMs}
				mountOnEnter
				unmountOnExit
			>
				{state => (
					<div style={{ ...baseStyle, ...overlayTransitionStyles[state] }}  className={s(`modal-overlay ${overlayClassName}`)} onClick={onOutsideClick} />
				)}
			</Transition>
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
	transitionMs: PropTypes.number,
}

Modal.defaultProps = {
	shouldCloseOnOutsideClick: false,
	overlayClassName: '',
	headerClassName: '',
	bodyClassName: '',
	className: '',
	overlayClassName: '',
	transitionMs: 100,
}

export default Modal;
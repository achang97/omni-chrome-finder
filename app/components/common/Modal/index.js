import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Transition } from 'react-transition-group';

import { MdClose } from 'react-icons/md';
import { FADE_IN_TRANSITIONS, NOOP } from '../../../utils/constants';
import { getBaseAnimationStyle } from '../../../utils/animateHelpers';

import style from './modal.css';
import { getStyleApplicationFn } from '../../../utils/styleHelpers';
const s = getStyleApplicationFn(style);

const Modal = ({ isOpen, transitionMs, shouldCloseOnOutsideClick, showHeader, className, onRequestClose, headerClassName, overlayClassName, bodyClassName, title, children, important }) => {
	const onOutsideClick = () => {
		if (shouldCloseOnOutsideClick && onRequestClose) onRequestClose();
	}

	const baseStyle = getBaseAnimationStyle(transitionMs);
	const modalTransitionStyles = {
		entering: { opacity: 0, transform: 'translate(0, -50%) scale(0.5)' },
		entered:  { opacity: 1, transform: 'translate(0, -50%)', visibility: 'visible' },
		exiting:  { opacity: 1, transform: 'translate(0, -50%) scale(0.5)' },
		exited:  { opacity: 0, visibility: 'hidden' },
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
					<div style={{ ...baseStyle, ...modalTransitionStyles[state] }} className={s(`modal ${className} ${important? 'modal-important' : ''}`)}>
						{ showHeader &&
							<div className={s(`modal-header ${headerClassName}`)}>
								<div className={s("font-semibold")}> {title} </div>
								<button onClick={onRequestClose}> <MdClose className={s("text-purple-gray-50")} /> </button>
							</div>
						}
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
					<div style={{ ...baseStyle, ...FADE_IN_TRANSITIONS[state] }}  className={s(`modal-overlay ${overlayClassName} ${important? 'modal-overlay-important' : ''}`)} onClick={onOutsideClick} />
				)}
			</Transition>
		</div>
	);
}

Modal.propTypes = {
	isOpen: PropTypes.bool,
	onRequestClose: PropTypes.func,
	shouldCloseOnOutsideClick: PropTypes.bool,
	className: PropTypes.string,
	headerClassName: PropTypes.string,
	bodyClassName: PropTypes.string,
	overlayClassName: PropTypes.string,
	title: PropTypes.string,
	showHeader: PropTypes.bool,
	transitionMs: PropTypes.number,
	important: PropTypes.bool,
}

Modal.defaultProps = {
	isOpen: false,
	shouldCloseOnOutsideClick: false,
	onRequestClose: NOOP,
	overlayClassName: '',
	headerClassName: '',
	bodyClassName: '',
	className: '',
	overlayClassName: '',
	transitionMs: 100,
	important: false,
	showHeader: true,
}

export default Modal;
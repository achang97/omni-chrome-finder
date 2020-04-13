import React from 'react';
import PropTypes from 'prop-types';
import { Transition } from 'react-transition-group';

import { MdClose } from 'react-icons/md';
import { TRANSITIONS } from 'appConstants/animate';
import { getBaseAnimationStyle } from 'utils/animate';

import style from './modal.css';
import { getStyleApplicationFn } from 'utils/style';

const s = getStyleApplicationFn(style);

const MODAL_TRANSITION_STYLES = {
  entering: { opacity: 0, transform: 'translate(0, -50%) scale(0.5)' },
  entered: { opacity: 1, transform: 'translate(0, -50%)', visibility: 'visible' },
  exiting: { opacity: 1, transform: 'translate(0, -50%) scale(0.5)' },
  exited: { opacity: 0, visibility: 'hidden' },
};

const Modal = ({ isOpen, transitionMs, shouldCloseOnOutsideClick, showHeader, className, onRequestClose, headerClassName, overlayClassName, bodyClassName, title, children, important, ...rest }) => {
  const onOutsideClick = () => {
    if (shouldCloseOnOutsideClick && onRequestClose) onRequestClose();
  };

  const baseStyle = getBaseAnimationStyle(transitionMs);

  return (
    <div
      onClick={e => e.stopPropagation()}
      onMouseOver={e => e.stopPropagation()}
      {...rest}
    >
      <Transition
        in={isOpen}
        timeout={transitionMs}
        mountOnEnter
        unmountOnExit
      >
        {state => (
          <div style={{ ...baseStyle, ...MODAL_TRANSITION_STYLES[state] }} className={s(`modal ${className} ${important ? 'modal-important' : ''}`)}>
            { showHeader &&
            <div className={s(`modal-header ${headerClassName}`)}>
              <div className={s('font-semibold')}> {title} </div>
              { onRequestClose && 
                <button onClick={onRequestClose}> <MdClose className={s('text-purple-gray-50')} /> </button>
              }
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
          <div style={{ ...baseStyle, ...TRANSITIONS.FADE_IN[state] }} className={s(`modal-overlay ${overlayClassName} ${important ? 'modal-overlay-important' : ''}`)} onClick={onOutsideClick} />
        )}
      </Transition>
    </div>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool,
  onRequestClose: PropTypes.func,
  shouldCloseOnOutsideClick: PropTypes.bool,
  className: PropTypes.string,
  headerClassName: PropTypes.string,
  bodyClassName: PropTypes.string,
  overlayClassName: PropTypes.string,
  title: PropTypes.any,
  showHeader: PropTypes.bool,
  transitionMs: PropTypes.number,
  important: PropTypes.bool,
};

Modal.defaultProps = {
  isOpen: false,
  shouldCloseOnOutsideClick: false,
  overlayClassName: '',
  headerClassName: '',
  bodyClassName: '',
  className: '',
  overlayClassName: '',
  transitionMs: 100,
  important: false,
  showHeader: true,
};

export default Modal;

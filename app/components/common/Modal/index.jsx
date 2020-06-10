import React from 'react';
import PropTypes from 'prop-types';
import { Transition } from 'react-transition-group';

import { MdClose } from 'react-icons/md';
import { ANIMATE, NOOP } from 'appConstants';
import { getBaseAnimationStyle } from 'utils/animate';
import { getStyleApplicationFn } from 'utils/style';

import Button from '../Button';
import Loader from '../Loader';

import style from './modal.css';

const s = getStyleApplicationFn(style);

const MODAL_TRANSITION_STYLES = {
  entering: { opacity: 0, transform: 'translate(-50%, -50%) scale(0.5)' },
  entered: { opacity: 1, transform: 'translate(-50%, -50%)', visibility: 'visible' },
  exiting: { opacity: 1, transform: 'translate(-50%, -50%) scale(0.5)' },
  exited: { opacity: 0, visibility: 'hidden' }
};

const getButtonProps = (props) => {
  const { disabled, isLoading = false, icon, ...rest } = props || {};

  const isLoadingProps = {
    iconLeft: false,
    icon: isLoading ? <Loader className={s('ml-sm')} size="sm" color="white" /> : icon
  };

  return {
    ...rest,
    disabled: disabled || isLoading,
    ...(isLoading ? isLoadingProps : {})
  };
};

const Modal = ({
  isOpen,
  transitionMs,
  shouldCloseOnOutsideClick,
  showHeader,
  className,
  onRequestClose,
  primaryButtonProps,
  secondaryButtonProps,
  showPrimaryButton,
  headerClassName,
  overlayClassName,
  bodyClassName,
  title,
  children,
  fixed,
  important
}) => {
  const onOutsideClick = () => {
    if (shouldCloseOnOutsideClick && onRequestClose) onRequestClose();
  };

  const baseStyle = getBaseAnimationStyle(transitionMs);
  const extendedPrimaryButtonProps = getButtonProps(primaryButtonProps);

  return (
    <div
      className={s(
        `${fixed ? `modal-container-fixed ${!isOpen ? 'pointer-events-none' : ''}` : ''}`
      )}
    >
      <Transition in={isOpen} timeout={transitionMs} mountOnEnter unmountOnExit>
        {(state) => (
          <div
            style={{ ...baseStyle, ...MODAL_TRANSITION_STYLES[state] }}
            className={s(`modal ${className} ${important ? 'modal-important' : ''}`)}
            onClick={(e) => e.stopPropagation()}
            onMouseOver={(e) => e.stopPropagation()}
            onFocus={NOOP}
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (showPrimaryButton && !extendedPrimaryButtonProps.disabled) {
                  if (extendedPrimaryButtonProps.onClick) {
                    extendedPrimaryButtonProps.onClick();
                  } else {
                    onRequestClose();
                  }
                }
              }}
              className={s('min-h-0 flex-1 flex flex-col')}
            >
              {showHeader && (
                <div className={s(`modal-header ${headerClassName}`)}>
                  <div className={s('font-semibold')}> {title} </div>
                  {onRequestClose && (
                    <button onClick={onRequestClose} type="button">
                      <MdClose className={s('text-purple-gray-50')} />
                    </button>
                  )}
                </div>
              )}
              <div className={s(`modal-body ${bodyClassName}`)}>{children}</div>
              {(showPrimaryButton || secondaryButtonProps) && (
                <div className={s(secondaryButtonProps ? 'flex py-sm px-reg' : '')}>
                  {secondaryButtonProps && (
                    <Button
                      color="transparent"
                      className={s('flex-1 mr-reg')}
                      underline
                      {...getButtonProps(secondaryButtonProps)}
                    />
                  )}
                  {showPrimaryButton && (
                    <Button
                      color="primary"
                      underline
                      underlineColor="purple-gray-50"
                      className={s(`flex-1 ${secondaryButtonProps ? 'ml-reg' : 'rounded-t-none'}`)}
                      onClick={onRequestClose}
                      text="Close"
                      {...extendedPrimaryButtonProps}
                    />
                  )}
                  <input className={s('hidden')} type="submit" />
                </div>
              )}
            </form>
          </div>
        )}
      </Transition>
      <Transition in={isOpen} timeout={transitionMs} mountOnEnter unmountOnExit>
        {(state) => (
          <div
            style={{ ...baseStyle, ...ANIMATE.TRANSITIONS.FADE_IN[state] }}
            className={s(
              `modal-overlay ${overlayClassName} ${important ? 'modal-overlay-important' : ''}`
            )}
            onClick={onOutsideClick}
          />
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
  title: PropTypes.node,
  showHeader: PropTypes.bool,
  transitionMs: PropTypes.number,
  important: PropTypes.bool,
  fixed: PropTypes.bool,
  primaryButtonProps: PropTypes.shape({
    disabled: PropTypes.bool,
    isLoading: PropTypes.bool,
    icon: PropTypes.node
  }),
  secondaryButtonProps: PropTypes.shape({
    disabled: PropTypes.bool,
    isLoading: PropTypes.bool,
    icon: PropTypes.node,
    onClick: PropTypes.func.isRequired
  }),
  showPrimaryButton: PropTypes.bool,
  children: PropTypes.node.isRequired
};

Modal.defaultProps = {
  isOpen: false,
  onRequestClose: null,
  shouldCloseOnOutsideClick: false,
  overlayClassName: '',
  headerClassName: '',
  bodyClassName: '',
  className: '',
  title: null,
  primaryButtonProps: null,
  secondaryButtonProps: null,
  transitionMs: 100,
  important: false,
  fixed: false,
  showHeader: true,
  showPrimaryButton: true
};

export default Modal;

import React from 'react';
import PropTypes from 'prop-types';

import { getStyleApplicationFn } from 'utils/style';
import style from './confirm-modal.css';

import Modal from '../Modal';
import Message from '../Message';

const s = getStyleApplicationFn(style);

const ConfirmModal = ({
  isOpen,
  title,
  description,
  body,
  error,
  onRequestClose,
  primaryButtonProps,
  secondaryButtonProps,
  showPrimary,
  showSecondary,
  shouldCloseOnOutsideClick,
  important,
  bodyClassName,
  overlayClassName
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      bodyClassName={s('overflow-visible')}
      overlayClassName={s(`rounded-b-lg ${overlayClassName}`)}
      shouldCloseOnOutsideClick={shouldCloseOnOutsideClick}
      title={title}
      important={important}
      secondaryButtonProps={
        showSecondary ? { text: 'No', onClick: onRequestClose, ...secondaryButtonProps } : null
      }
      primaryButtonProps={
        showPrimary ? { text: 'Yes', onClick: onRequestClose, ...primaryButtonProps } : null
      }
    >
      <div className={s(`confirm-modal-body ${bodyClassName}`)}>
        {description && <div> {description} </div>}
        {body}
        <Message className={s('mt-xs')} message={error} type="error" />
      </div>
    </Modal>
  );
};

ConfirmModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  body: PropTypes.node,
  error: PropTypes.string,
  onRequestClose: PropTypes.func,
  primaryButtonProps: PropTypes.shape({
    text: PropTypes.node,
    onClick: PropTypes.func.isRequired
  }),
  secondaryButtonProps: PropTypes.shape({
    text: PropTypes.node,
    onClick: PropTypes.func
  }),
  showPrimary: PropTypes.bool,
  showSecondary: PropTypes.bool,
  shouldCloseOnOutsideClick: PropTypes.bool,
  important: PropTypes.bool,
  overlayClassName: PropTypes.string,
  bodyClassName: PropTypes.string
};

ConfirmModal.defaultProps = {
  showPrimary: true,
  showSecondary: true,
  secondaryButtonProps: null,
  description: null,
  body: null,
  error: null,
  onRequestClose: null,
  shouldCloseOnOutsideClick: false,
  important: false,
  overlayClassName: '',
  bodyClassName: ''
};

export default ConfirmModal;

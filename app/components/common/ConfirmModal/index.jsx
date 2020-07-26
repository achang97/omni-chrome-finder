import React from 'react';
import PropTypes from 'prop-types';

import { getStyleApplicationFn } from 'utils/style';
import style from './confirm-modal.css';

import Modal from '../Modal';
import Message from '../Message';
import Button from '../Button';

const s = getStyleApplicationFn(style);

const ConfirmModal = ({
  isOpen,
  title,
  description,
  body,
  error,
  onClose,
  primaryButtonProps,
  secondaryButtonProps,
  showPrimary,
  showSecondary,
  shouldCloseOnOutsideClick,
  important,
  zIndex,
  bodyClassName,
  overlayClassName
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      bodyClassName={s(`confirm-modal-body ${bodyClassName}`)}
      overlayClassName={s(`rounded-b-lg ${overlayClassName}`)}
      shouldCloseOnOutsideClick={shouldCloseOnOutsideClick}
      title={title}
      important={important}
      zIndex={zIndex}
      secondaryButtonProps={
        showSecondary ? { text: 'No', onClick: onClose, ...secondaryButtonProps } : null
      }
      primaryButtonProps={
        showPrimary ? { text: 'Yes', onClick: onClose, ...primaryButtonProps } : null
      }
      showPrimaryButton={showPrimary}
    >
      {description && <div> {description} </div>}
      {body}
      <Message className={s('mt-xs')} message={error} type="error" />
    </Modal>
  );
};

ConfirmModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  title: PropTypes.string,
  description: PropTypes.string,
  body: PropTypes.node,
  error: PropTypes.string,
  onClose: PropTypes.func,
  primaryButtonProps: PropTypes.shape(Button.propTypes).isRequired,
  secondaryButtonProps: PropTypes.shape(Button.propTypes),
  showPrimary: PropTypes.bool,
  showSecondary: PropTypes.bool,
  shouldCloseOnOutsideClick: PropTypes.bool,
  important: PropTypes.bool,
  zIndex: PropTypes.number,
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
  onClose: null,
  shouldCloseOnOutsideClick: false,
  important: false,
  overlayClassName: '',
  bodyClassName: ''
};

export default ConfirmModal;

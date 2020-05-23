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
  bodyClassName,
  overlayClassName
}) => {
  if (!secondaryButtonProps) {
    // eslint-disable-next-line no-param-reassign
    secondaryButtonProps = { text: 'No', onClick: onRequestClose };
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      bodyClassName={s('overflow-visible')}
      overlayClassName={s(`rounded-b-lg ${overlayClassName}`)}
      title={title}
      important
      secondaryButtonProps={showSecondary ? secondaryButtonProps : null}
      primaryButtonProps={showPrimary ? primaryButtonProps : null}
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
    text: PropTypes.node.isRequired,
    onClick: PropTypes.func.isRequired
  }),
  secondaryButtonProps: PropTypes.shape({
    text: PropTypes.node.isRequired,
    onClick: PropTypes.func.isRequired
  }),
  showPrimary: PropTypes.bool,
  showSecondary: PropTypes.bool,
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
  overlayClassName: '',
  bodyClassName: ''
};

export default ConfirmModal;
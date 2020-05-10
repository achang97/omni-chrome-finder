import React from 'react';
import PropTypes from 'prop-types';

import { Modal, Message } from 'components/common';

import { getStyleApplicationFn } from 'utils/style';
import style from './card-confirm-modal.css';

const s = getStyleApplicationFn(style);

const CardConfirmModal = ({
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
      headerClassName={s('bg-purple-light')}
      overlayClassName={s(`rounded-b-lg ${overlayClassName}`)}
      title={title}
      important
      secondaryButtonProps={showSecondary ? secondaryButtonProps : null}
      primaryButtonProps={showPrimary ? primaryButtonProps : null}
    >
      <div className={s(`card-confirm-modal-body ${bodyClassName}`)}>
        {description && <div> {description} </div>}
        {body}
        <Message className={s('mt-xs')} message={error} type="error" />
      </div>
    </Modal>
  );
};

CardConfirmModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  body: PropTypes.node,
  error: PropTypes.string,
  onRequestClose: PropTypes.func.isRequired,
  primaryButtonProps: PropTypes.shape({
    text: PropTypes.node.isRequired,
    onClick: PropTypes.func.isRequired
  }).isRequired,
  secondaryButtonProps: PropTypes.shape({
    text: PropTypes.node.isRequired,
    onClick: PropTypes.func.isRequired
  }),
  showPrimary: PropTypes.bool,
  showSecondary: PropTypes.bool,
  overlayClassName: PropTypes.string,
  bodyClassName: PropTypes.string
};

CardConfirmModal.defaultProps = {
  showPrimary: true,
  showSecondary: true,
  secondaryButtonProps: null,
  description: null,
  body: null,
  error: null,
  overlayClassName: '',
  bodyClassName: ''
};

export default CardConfirmModal;

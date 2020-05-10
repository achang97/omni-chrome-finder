import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/common/Modal';

import { getStyleApplicationFn } from 'utils/style';

const s = getStyleApplicationFn();

const MessageModal = ({
  modalOpen,
  modalProps: { title, subtitle, buttonText, showHeader = true },
  closeModal
}) => (
  <Modal
    isOpen={modalOpen}
    onRequestClose={closeModal}
    showHeader={showHeader}
    title={title}
    shouldCloseOnOutsideClick
    overlayClassName={s('rounded-bl-lg rounded-tl-lg')}
    bodyClassName={s('rounded-bl-lg rounded-tl-lg flex flex-col')}
    primaryButtonProps={{
      text: buttonText || 'Ok'
    }}
  >
    <div className={s('p-xl')}>
      {!showHeader && <div className={s(subtitle ? 'mt-lg' : '')}> {title} </div>}
      {subtitle && <div className={s('text-center text-sm')}> {subtitle} </div>}
    </div>
  </Modal>
);

MessageModal.propTypes = {
  // Redux State
  modalProps: PropTypes.shape({
    title: PropTypes.node.isRequired,
    subtitle: PropTypes.node,
    buttonText: PropTypes.node,
    showHeader: PropTypes.bool
  }).isRequired,
  modalOpen: PropTypes.bool.isRequired,

  // Redux Actions
  closeModal: PropTypes.func.isRequired
};

export default MessageModal;

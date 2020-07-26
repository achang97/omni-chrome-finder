import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/common/Modal';

import { getStyleApplicationFn } from 'utils/style';

const s = getStyleApplicationFn();

const MessageModal = ({
  modalOpen,
  modalProps: { title, subtitle, body, buttonProps = {}, showHeader = true },
  closeModal
}) => (
  <Modal
    isOpen={modalOpen}
    onClose={closeModal}
    showHeader={showHeader}
    title={title}
    shouldCloseOnOutsideClick
    overlayClassName={s('rounded-bl-lg rounded-tl-lg')}
    bodyClassName={s('rounded-bl-lg rounded-tl-lg flex flex-col')}
    primaryButtonProps={{
      ...buttonProps,
      text: buttonProps.text || 'Ok'
    }}
  >
    <div className={s('p-xl')}>
      {!showHeader && <div className={s(subtitle ? 'mt-lg' : '')}> {title} </div>}
      {subtitle && <div className={s('text-center text-sm')}> {subtitle} </div>}
      {body}
    </div>
  </Modal>
);

MessageModal.propTypes = {
  // Redux State
  modalOpen: PropTypes.bool.isRequired,
  modalProps: PropTypes.shape({
    title: PropTypes.node,
    subtitle: PropTypes.node,
    buttonProps: PropTypes.object,
    showHeader: PropTypes.bool,
    body: PropTypes.node
  }).isRequired,

  // Redux Actions
  closeModal: PropTypes.func.isRequired
};

export default MessageModal;

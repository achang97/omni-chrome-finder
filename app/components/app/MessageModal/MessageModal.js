import React from 'react';
import Modal from 'components/common/Modal';
import Button from 'components/common/Button';

import { getStyleApplicationFn } from 'utils/style';
const s = getStyleApplicationFn();

const MessageModal = ({
  modalOpen, modalProps: { title, subtitle, buttonText, showHeader=true },
  openModal, closeModal,
}) => (
  <Modal
    isOpen={modalOpen}
    onRequestClose={closeModal}
    showHeader={showHeader}
    title={title}
    shouldCloseOnOutsideClick
    overlayClassName={s('rounded-bl-lg rounded-tl-lg')}
    bodyClassName={s('rounded-bl-lg rounded-tl-lg flex flex-col')}
  >
    <div className={s('p-xl')}>
      { !showHeader && <div className={s('mb-lg')}> {title} </div> }
      <div className={s('text-center')}> {subtitle} </div>
    </div>
    <Button
      text={buttonText || 'Ok'}
      onClick={closeModal}
      className={s('flex-shrink-0 rounded-t-none')}
      underline
      underlineColor="purple-gray-50"
      color="primary"
    />
  </Modal>
);

export default MessageModal;
import React from 'react';
import Modal from 'components/common/Modal';
import Button from 'components/common/Button';

import { getStyleApplicationFn } from 'utils/style';
const s = getStyleApplicationFn();

const MessageModal = ({
  modalOpen, modalProps: { title, subtitle, buttonText },
  openModal, closeModal,
}) => (
  <Modal
    isOpen={modalOpen}
    onRequestClose={closeModal}
    showHeader={false}
    shouldCloseOnOutsideClick
    overlayClassName={s('rounded-bl-lg rounded-tl-lg')}
    bodyClassName={s('rounded-bl-lg rounded-tl-lg flex flex-col')}
  >
    <div className={s('p-xl')}>
      <div> {title} </div>
      <div className={s('mt-lg text-center')}> {subtitle} </div>
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
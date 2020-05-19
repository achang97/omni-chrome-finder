import React from 'react';
import PropTypes from 'prop-types';

import { Modal } from 'components/common';
import { FinderView } from 'components/finder';
import { MODAL_TYPE, STATUS } from 'appConstants/card';

import { getStyleApplicationFn } from 'utils/style';

const s = getStyleApplicationFn();

const CardFinderModal = ({ _id, status, startNodeId, isOpen, openCardModal, closeCardModal, updateCardPath, closeFinder }) => {
  const onClose = () => {
    closeCardModal(MODAL_TYPE.FINDER);
    closeFinder(_id);
    if (status === STATUS.NOT_DOCUMENTED) {
      openCardModal(MODAL_TYPE.CREATE);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={() => closeCardModal(MODAL_TYPE.FINDER)}
      showHeader={false}
      overlayClassName={s('rounded-b-lg')}
      className={s('h-full')}
      bodyClassName={s('rounded-b-lg flex flex-col h-full')}
      showPrimaryButton={false}
    >
      <FinderView
        finderId={_id}
        startNodeId={startNodeId}
        isModal
        onSecondaryClick={onClose}
        onPrimaryClick={(path) => {
          onClose();
          updateCardPath(path);
        }}
      />
    </Modal>
  );
};

export default CardFinderModal;

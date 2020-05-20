import React from 'react';
import PropTypes from 'prop-types';

import { Modal } from 'components/common';
import { FinderView } from 'components/finder';
import { MODAL_TYPE, STATUS } from 'appConstants/card';

import { getStyleApplicationFn } from 'utils/style';

const s = getStyleApplicationFn();

const CardFinderModal = ({
  _id,
  status,
  startNodeId,
  isOpen,
  openCardModal,
  closeCardModal,
  updateCardFinderNode,
  closeFinder
}) => {
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
        onPrimaryClick={(finderNode) => {
          onClose();
          updateCardFinderNode(finderNode);
        }}
      />
    </Modal>
  );
};

CardFinderModal.propTypes = {
  // Redux State
  _id: PropTypes.string.isRequired,
  status: PropTypes.oneOf(Object.values(STATUS)).isRequired,
  startNodeId: PropTypes.string,
  isOpen: PropTypes.bool.isRequired,

  // Redux Actions
  openCardModal: PropTypes.func.isRequired,
  closeCardModal: PropTypes.func.isRequired,
  updateCardFinderNode: PropTypes.func.isRequired,
  closeFinder: PropTypes.func.isRequired
};

export default CardFinderModal;

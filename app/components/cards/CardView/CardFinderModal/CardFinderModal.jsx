import React from 'react';
import PropTypes from 'prop-types';

import { FinderModal } from 'components/finder';
import { MODAL_TYPE, STATUS } from 'appConstants/card';

const CardFinderModal = ({
  _id,
  status,
  startNodeId,
  isOpen,
  openCardModal,
  closeCardModal,
  updateCardFinderNode
}) => {
  const onClose = () => {
    closeCardModal(MODAL_TYPE.FINDER);
    if (status === STATUS.NOT_DOCUMENTED) {
      openCardModal(MODAL_TYPE.CREATE);
    }
  };

  return (
    <FinderModal
      isOpen={isOpen}
      finderId={_id}
      startNodeId={startNodeId}
      onSecondaryClick={onClose}
      onPrimaryClick={(finderNode) => {
        onClose();
        updateCardFinderNode(finderNode);
      }}
    />
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
  updateCardFinderNode: PropTypes.func.isRequired
};

export default CardFinderModal;

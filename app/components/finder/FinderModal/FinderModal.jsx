import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { Modal } from 'components/common';
import { getStyleApplicationFn } from 'utils/style';

import FinderView from '../FinderView';

const s = getStyleApplicationFn();

const FinderModal = ({
  isOpen,
  finderId,
  startNodeId,
  onClose,
  onSecondaryClick,
  onPrimaryClick,
  isPrimaryDisabled,
  isLoading,
  overlayClassName,
  closeFinder
}) => {
  useEffect(() => {
    if (!isOpen) {
      if (onClose) {
        onClose();
      }

      closeFinder(finderId);
    }
  }, [isOpen, onClose, closeFinder, finderId]);

  return (
    <Modal
      isOpen={isOpen}
      showHeader={false}
      overlayClassName={s(`rounded-b-lg ${overlayClassName}`)}
      className={s('h-full')}
      bodyClassName={s('rounded-b-lg flex flex-col h-full')}
      showPrimaryButton={false}
    >
      <FinderView
        finderId={finderId}
        isModal
        startNodeId={startNodeId}
        onSecondaryClick={onSecondaryClick}
        onPrimaryClick={onPrimaryClick}
        isPrimaryDisabled={isPrimaryDisabled}
        isLoading={isLoading}
      />
    </Modal>
  );
};

FinderModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  finderId: PropTypes.string.isRequired,
  startNodeId: PropTypes.string,
  onClose: PropTypes.func,
  onSecondaryClick: PropTypes.func.isRequired,
  onPrimaryClick: PropTypes.func.isRequired,
  isPrimaryDisabled: PropTypes.func,
  isLoading: PropTypes.bool,
  overlayClassName: PropTypes.string,

  // Redux Actions
  closeFinder: PropTypes.func.isRequired
};

FinderModal.defaultProps = {
  overlayClassName: ''
};

export default FinderModal;

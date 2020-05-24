import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { Modal } from 'components/common';
import { getStyleApplicationFn } from 'utils/style';

import style from './finder-modal.css';

import FinderView from '../FinderView';

const s = getStyleApplicationFn(style);

const FinderModal = ({
  isOpen,
  important,
  finderId,
  startNodeId,
  onClose,
  onSecondaryClick,
  onPrimaryClick,
  isPrimaryDisabled,
  isLoading,
  className,
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
      important={important}
      showHeader={false}
      overlayClassName={s(`finder-modal-overlay ${overlayClassName}`)}
      className={s(`finder-modal ${className}`)}
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
  important: PropTypes.bool,
  finderId: PropTypes.string.isRequired,
  startNodeId: PropTypes.string,
  onClose: PropTypes.func,
  onSecondaryClick: PropTypes.func.isRequired,
  onPrimaryClick: PropTypes.func.isRequired,
  isPrimaryDisabled: PropTypes.func,
  isLoading: PropTypes.bool,
  className: PropTypes.string,
  overlayClassName: PropTypes.string,

  // Redux Actions
  closeFinder: PropTypes.func.isRequired
};

FinderModal.defaultProps = {
  important: false,
  className: '',
  overlayClassName: ''
};

export default FinderModal;

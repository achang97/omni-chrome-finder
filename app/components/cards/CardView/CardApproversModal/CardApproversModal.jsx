import React from 'react';
import PropTypes from 'prop-types';

import { Modal, Message } from 'components/common';
import { CardUsers } from 'components/cards';
import { MODAL_TYPE } from 'appConstants/card';
import { ROLE } from 'appConstants/user';

import { getStyleApplicationFn } from 'utils/style';
import { isExistingCard } from 'utils/card';

const s = getStyleApplicationFn();

const CardApproversModal = ({
  _id,
  createError,
  updateError,
  isCreatingCard,
  isUpdatingCard,
  approvers,
  isOpen,
  hasValidEdits,
  addCardApprover,
  removeCardApprover,
  requestCreateCard,
  requestUpdateCard,
  openCardModal,
  closeCardModal
}) => {
  const isExisting = isExistingCard(_id);

  let isLoading;
  let onClick;
  let error;

  if (isExisting) {
    isLoading = isUpdatingCard;
    onClick = () => requestUpdateCard(false);
    error = updateError;
  } else {
    isLoading = isCreatingCard;
    onClick = requestCreateCard;
    error = createError;
  }

  const primaryButtonProps = {
    text: 'Send for Approval',
    onClick,
    isLoading,
    disabled: !hasValidEdits || approvers.length === 0
  };

  const onClose = () => {
    closeCardModal(MODAL_TYPE.ADD_APPROVERS);
    openCardModal(MODAL_TYPE.CREATE);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Approvers"
      overlayClassName={s('rounded-b-lg')}
      bodyClassName={s('text-sm p-lg')}
      primaryButtonProps={primaryButtonProps}
    >
      <div className={s('mb-lg')}>
        You have view access. To publish this card, it <span> must be approved </span>
        by an <b>Admin</b> or <b>Editor</b>.
      </div>
      <div className={s('mb-reg')}>
        Please select one or more team members to approve this card.
      </div>
      <CardUsers
        isEditable
        users={approvers}
        onAdd={addCardApprover}
        onRemoveClick={({ index }) => removeCardApprover(index)}
        disabledUserRoles={[ROLE.VIEWER]}
        showSelect
        showTooltips
        size="sm"
        className={s('mb-reg')}
      />
      <div className={s('font-bold text-xs mb-sm')}>
        * Only one approver needs to approve for this card to be published.
      </div>
      <Message message={error} type="error" />
    </Modal>
  );
};

CardApproversModal.propTypes = {
  // Redux State
  _id: PropTypes.string.isRequired,
  createError: PropTypes.string,
  updateError: PropTypes.string,
  isCreatingCard: PropTypes.bool,
  isUpdatingCard: PropTypes.bool,
  approvers: PropTypes.arrayOf(PropTypes.object),
  isOpen: PropTypes.bool.isRequired,
  hasValidEdits: PropTypes.bool.isRequired,

  // Redux Actions
  addCardApprover: PropTypes.func.isRequired,
  removeCardApprover: PropTypes.func.isRequired,
  requestCreateCard: PropTypes.func.isRequired,
  requestUpdateCard: PropTypes.func.isRequired,
  openCardModal: PropTypes.func.isRequired,
  closeCardModal: PropTypes.func.isRequired
};

export default CardApproversModal;

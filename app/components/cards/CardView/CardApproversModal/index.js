import { connect } from 'react-redux';
import { MODAL_TYPE } from 'appConstants/card';
import {
  addCardApprover,
  removeCardApprover,
  requestCreateCard,
  requestUpdateCard,
  openCardModal,
  closeCardModal
} from 'actions/cards';
import { hasValidEdits } from 'utils/card';
import CardApproversModal from './CardApproversModal';

const mapStateToProps = (state) => {
  const {
    cards: { activeCard }
  } = state;

  const {
    _id,
    createError,
    updateError,
    isCreatingCard,
    isUpdatingCard,
    edits,
    modalOpen: { [MODAL_TYPE.ADD_APPROVERS]: isOpen }
  } = activeCard;

  return {
    _id,
    createError,
    updateError,
    isCreatingCard,
    isUpdatingCard,
    isOpen,
    approvers: edits.approvers || [],
    hasValidEdits: hasValidEdits(activeCard)
  };
};

const mapDispatchToProps = {
  addCardApprover,
  removeCardApprover,
  requestCreateCard,
  requestUpdateCard,
  openCardModal,
  closeCardModal
};

export default connect(mapStateToProps, mapDispatchToProps)(CardApproversModal);

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
    cards: {
      activeCard: {
        _id,
        createError,
        updateError,
        isCreatingCard,
        isUpdatingCard,
        edits,
        modalOpen: { [MODAL_TYPE.ADD_APPROVERS]: isOpen }
      }
    }
  } = state;

  return {
    _id,
    createError,
    updateError,
    isCreatingCard,
    isUpdatingCard,
    isOpen,
    approvers: edits.approvers || [],
    hasValidEdits: hasValidEdits(edits)
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

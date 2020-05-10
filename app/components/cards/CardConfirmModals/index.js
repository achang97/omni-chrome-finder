import { connect } from 'react-redux';
import {
  updateOutOfDateReason,
  updateCardSelectedThreadIndex,
  toggleCardSelectedMessage,
  openCardModal,
  closeCardModal,
  closeCard,
  cancelEditCard,
  cancelEditCardMessages,
  updateCardStatus,
  requestDeleteCard,
  requestUpdateCard,
  requestMarkUpToDate,
  requestMarkOutOfDate,
  requestApproveCard  
} from 'actions/cards';
import CardConfirmModals from './CardConfirmModals';

const mapStateToProps = (state) => {
  const {
    cards: { activeCard, activeCardIndex }
  } = state;

  return { ...activeCard, activeCardIndex };
};

const mapDispatchToProps = {
  updateOutOfDateReason,
  updateCardSelectedThreadIndex,
  toggleCardSelectedMessage,
  openCardModal,
  closeCardModal,
  closeCard,
  cancelEditCard,
  cancelEditCardMessages,
  updateCardStatus,
  requestDeleteCard,
  requestUpdateCard,
  requestMarkUpToDate,
  requestMarkOutOfDate,
  requestApproveCard
};

export default connect(mapStateToProps, mapDispatchToProps)(CardConfirmModals);

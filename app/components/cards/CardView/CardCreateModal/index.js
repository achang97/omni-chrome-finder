import { connect } from 'react-redux';
import {
  requestCreateCard,
  requestUpdateCard,
  openCardModal,
  closeCardModal,
  addCardOwner,
  removeCardOwner,
  addCardSubscriber,
  removeCardSubscriber,
  updateCardTags,
  removeCardTag,
  updateCardVerificationInterval,
  updateCardPermissions,
  updateCardPermissionGroups
} from 'actions/cards';
import { MODAL_TYPE } from 'appConstants/card';
import CardCreateModal from './CardCreateModal';

const mapStateToProps = (state) => {
  const {
    cards: {
      activeCard: {
        _id,
        createError,
        isCreatingCard,
        isUpdatingCard,
        isEditing,
        edits,
        modalOpen: { [MODAL_TYPE.CREATE]: isOpen }
      }
    }
  } = state;

  return {
    _id,
    createError,
    isCreatingCard,
    isUpdatingCard,
    isEditing,
    edits,
    isOpen
  };
};

const mapDispatchToProps = {
  requestCreateCard,
  requestUpdateCard,
  openCardModal,
  closeCardModal,
  addCardOwner,
  removeCardOwner,
  addCardSubscriber,
  removeCardSubscriber,
  updateCardTags,
  removeCardTag,
  updateCardVerificationInterval,
  updateCardPermissions,
  updateCardPermissionGroups
};

export default connect(mapStateToProps, mapDispatchToProps)(CardCreateModal);

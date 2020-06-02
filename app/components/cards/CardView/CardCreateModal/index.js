import { connect } from 'react-redux';
import _ from 'lodash';
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
import { requestUpdateUser } from 'actions/profile';
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
        edits,
        modalOpen: { [MODAL_TYPE.CREATE]: isOpen }
      }
    },
    profile: {
      user: { seenFeatures }
    }
  } = state;

  return {
    _id,
    createError,
    isCreatingCard,
    isUpdatingCard,
    edits,
    isOpen,
    seenFeatures: _.omit(seenFeatures, '_id')
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
  updateCardPermissionGroups,
  requestUpdateUser
};

export default connect(mapStateToProps, mapDispatchToProps)(CardCreateModal);

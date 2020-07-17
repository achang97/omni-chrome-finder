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
  addCardApprover,
  removeCardApprover,
  updateCardTags,
  removeCardTag,
  updateCardVerificationInterval,
  updateCardPermissions,
  updateCardPermissionGroups,
  updateInviteType,
  updateInviteEmail
} from 'actions/cards';
import { requestUpdateUser } from 'actions/profile';
import { isEditor } from 'utils/auth';
import { MODAL_TYPE } from 'appConstants/card';
import CardCreateModal from './CardCreateModal';

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
        modalOpen: { [MODAL_TYPE.CREATE]: isOpen }
      }
    },
    profile: {
      user: { seenFeatures, role }
    }
  } = state;

  return {
    _id,
    createError,
    updateError,
    isCreatingCard,
    isUpdatingCard,
    edits,
    isOpen,
    isEditor: isEditor(role),
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
  addCardApprover,
  removeCardApprover,
  updateCardTags,
  removeCardTag,
  updateCardVerificationInterval,
  updateCardPermissions,
  updateCardPermissionGroups,
  updateInviteType,
  updateInviteEmail,
  requestUpdateUser
};

export default connect(mapStateToProps, mapDispatchToProps)(CardCreateModal);

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
import { hasValidEdits } from 'utils/card';
import { MODAL_TYPE } from 'appConstants/card';
import CardCreateModal from './CardCreateModal';

const mapStateToProps = (state) => {
  const {
    cards: { activeCard },
    profile: { user }
  } = state;

  const {
    _id,
    createError,
    updateError,
    isCreatingCard,
    isUpdatingCard,
    edits,
    modalOpen: { [MODAL_TYPE.CREATE]: isOpen }
  } = activeCard;

  const { _id: ownUserId, seenFeatures } = user;

  return {
    _id,
    createError,
    updateError,
    isCreatingCard,
    isUpdatingCard,
    edits,
    isOpen,
    ownUserId,
    isEditor: isEditor(user),
    seenFeatures: _.omit(seenFeatures, '_id'),
    hasValidEdits: hasValidEdits(activeCard)
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

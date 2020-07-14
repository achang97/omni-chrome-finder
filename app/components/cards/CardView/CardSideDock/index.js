import { connect } from 'react-redux';
import {
  closeCardSideDock,
  openCardModal,
  closeCardModal,
  removeCardAttachment,
  updateCardAttachmentName,
  addCardOwner,
  removeCardOwner,
  addCardSubscriber,
  removeCardSubscriber,
  updateCardTags,
  removeCardTag,
  updateCardVerificationInterval,
  updateCardPermissions,
  updateCardPermissionGroups,
  updateInviteType,
  updateInviteEmail,
  editCard
} from 'actions/cards';
import { ROLE } from 'appConstants/user';
import CardSideDock from './CardSideDock';

const mapStateToProps = (state) => {
  const {
    cards: {
      activeCard: {
        isEditing,
        status,
        finderNode,
        owners,
        subscribers,
        attachments,
        tags,
        permissions,
        permissionGroups,
        verificationInterval,
        isDeletingCard,
        createdAt,
        updatedAt,
        sideDockOpen,
        edits
      }
    },
    profile: {
      user: { role, _id: userId }
    }
  } = state;

  return {
    hasDeleteAccess: role === ROLE.ADMIN || owners.some(({ _id }) => _id === userId),
    isEditing,
    status,
    finderNode,
    owners,
    subscribers,
    attachments,
    tags,
    permissions,
    permissionGroups,
    verificationInterval,
    isDeletingCard,
    createdAt,
    updatedAt,
    sideDockOpen,
    edits
  };
};

const mapDispatchToProps = {
  closeCardSideDock,
  openCardModal,
  closeCardModal,
  addCardOwner,
  removeCardOwner,
  addCardSubscriber,
  removeCardSubscriber,
  removeCardAttachment,
  updateCardAttachmentName,
  updateCardTags,
  removeCardTag,
  updateCardVerificationInterval,
  updateCardPermissions,
  updateCardPermissionGroups,
  updateInviteType,
  updateInviteEmail,
  editCard
};

export default connect(mapStateToProps, mapDispatchToProps)(CardSideDock);

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
  addCardEditViewer,
  removeCardEditViewer,
  updateCardTags,
  removeCardTag,
  updateCardVerificationInterval,
  updateCardPermissions,
  updateCardPermissionGroups,
  updateInviteType,
  updateInviteEmail,
  editCard
} from 'actions/cards';
import { canEditCard } from 'utils/card';
import CardSideDock from './CardSideDock';

const mapStateToProps = (state) => {
  const {
    cards: { activeCard },
    profile: { user }
  } = state;

  const {
    isEditing,
    status,
    finderNode,
    owners,
    subscribers,
    approvers,
    editUserPermissions,
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
  } = activeCard;

  const canEdit = canEditCard(user, activeCard);

  return {
    canEdit,
    isEditing: isEditing && canEdit,
    status,
    finderNode,
    owners,
    subscribers,
    approvers,
    editUserPermissions,
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
  addCardEditViewer,
  removeCardEditViewer,
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

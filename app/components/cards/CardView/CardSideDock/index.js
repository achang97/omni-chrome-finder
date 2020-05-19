import { connect } from 'react-redux';
import {
  closeCardSideDock,
  openCardModal,
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
  editCard
} from 'actions/cards';
import CardSideDock from './CardSideDock';

const mapStateToProps = (state) => {
  const {
    cards: {
      activeCard: {
        isEditing,
        status,
        path,
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
    }
  } = state;

  return {
    isEditing,
    status,
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
  editCard
};

export default connect(mapStateToProps, mapDispatchToProps)(CardSideDock);

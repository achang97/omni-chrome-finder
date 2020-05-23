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
  editCard
} from 'actions/cards';
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
    }
  } = state;

  return {
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
  editCard
};

export default connect(mapStateToProps, mapDispatchToProps)(CardSideDock);

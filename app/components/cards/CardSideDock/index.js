import { connect } from 'react-redux';
import {
  closeCardSideDock,
  openCardModal,
  removeCardAttachment, updateCardAttachmentName,
  addCardOwner, removeCardOwner,
  addCardSubscriber, removeCardSubscriber,
  updateCardTags, removeCardTag,
  updateCardKeywords,
  updateCardVerificationInterval, updateCardPermissions, updateCardPermissionGroups,
} from 'actions/cards';
import CardSideDock from './CardSideDock';

const mapStateToProps = state => {
  const {
    cards: {
      activeCard
    },
    auth: {
      token
    }
  } = state;

  return { ...activeCard, token };
}

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
  updateCardKeywords,
  updateCardVerificationInterval,
  updateCardPermissions,
  updateCardPermissionGroups,  
}

export default connect(mapStateToProps, mapDispatchToProps)(CardSideDock);

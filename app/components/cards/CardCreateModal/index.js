import { connect } from 'react-redux';
import {
  requestCreateCard,
  requestUpdateCard,
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
import CardCreateModal from './CardCreateModal';

const mapStateToProps = (state) => {
  const {
    cards: { activeCard }
  } = state;

  return { ...activeCard };
};

const mapDispatchToProps = {
  requestCreateCard,
  requestUpdateCard,
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

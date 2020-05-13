import { connect } from 'react-redux';
import { cancelEditCard, openCardModal, openCardSideDock } from 'actions/cards';
import { cardStateChanged } from 'utils/card';
import CardHeader from './CardHeader';

const mapStateToProps = (state) => {
  const {
    cards: {
      activeCard,
      activeCard: { tags, outOfDateReason }
    },
    profile: {
      user,
      user: { _id: ownUserId }
    }
  } = state;

  const {
    answer,
    attachments,
    _id,
    isEditing,
    status,
    lastEdited,
    lastVerified,
    createdAt
  } = activeCard;

  return {
    user,
    tags,
    outOfDateReason,
    ownUserId,
    answer,
    _id,
    isEditing,
    status,
    attachments,
    lastEdited,
    lastVerified,
    createdAt,
    hasCardChanged: cardStateChanged(activeCard)
  };
};

const mapDispatchToProps = {
  cancelEditCard,
  openCardModal,
  openCardSideDock
};

export default connect(mapStateToProps, mapDispatchToProps)(CardHeader);

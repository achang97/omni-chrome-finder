import { connect } from 'react-redux';
import { cancelEditCard, openCardModal, openCardSideDock } from 'actions/cards';
import { cardStateChanged } from 'utils/card';
import CardHeader from './CardHeader';

const mapStateToProps = (state) => {
  const {
    cards: { activeCard },
    profile: {
      user: { _id: ownUserId }
    }
  } = state;

  const { answer, _id, isEditing, status, lastEdited, lastVerified, createdAt } = activeCard;

  return {
    ownUserId,
    answer,
    _id,
    isEditing,
    status,
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

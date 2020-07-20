import { connect } from 'react-redux';
import { cancelEditCard, openCardModal, openCardSideDock, requestGetCard } from 'actions/cards';
import trackEvent from 'actions/analytics';
import { cardStateChanged, canEditCard } from 'utils/card';
import CardHeader from './CardHeader';

const mapStateToProps = (state) => {
  const {
    cards: { activeCard },
    profile: { user }
  } = state;

  const {
    answer,
    externalLinkAnswer,
    question,
    outOfDateReason,
    attachments,
    _id,
    isEditing,
    status,
    lastVerified
  } = activeCard;

  const { _id: ownUserId } = user;

  const canEdit = canEditCard(user, activeCard);

  return {
    user,
    outOfDateReason,
    ownUserId,
    answer,
    externalLink: externalLinkAnswer && externalLinkAnswer.link,
    _id,
    question,
    isEditing: isEditing && canEdit,
    status,
    attachments,
    lastVerified,
    hasCardChanged: cardStateChanged(activeCard)
  };
};

const mapDispatchToProps = {
  cancelEditCard,
  openCardModal,
  openCardSideDock,
  requestGetCard,
  trackEvent
};

export default connect(mapStateToProps, mapDispatchToProps)(CardHeader);

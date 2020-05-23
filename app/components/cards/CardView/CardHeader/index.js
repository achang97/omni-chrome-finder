import { connect } from 'react-redux';
import { cancelEditCard, openCardModal, openCardSideDock } from 'actions/cards';
import trackEvent from 'actions/analytics';
import { cardStateChanged } from 'utils/card';
import CardHeader from './CardHeader';

const mapStateToProps = (state) => {
  const {
    cards: { activeCard },
    profile: {
      user,
      user: { _id: ownUserId }
    }
  } = state;

  const {
    answer,
    externalLinkAnswer,
    question,
    tags,
    outOfDateReason,
    attachments,
    _id,
    isEditing,
    status,
    lastVerified
  } = activeCard;

  return {
    user,
    tags,
    outOfDateReason,
    ownUserId,
    answer,
    externalLink: externalLinkAnswer && externalLinkAnswer.link,
    _id,
    question,
    isEditing,
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
  trackEvent
};

export default connect(mapStateToProps, mapDispatchToProps)(CardHeader);

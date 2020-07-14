import { connect } from 'react-redux';
import {
  openCardModal,
  updateCardQuestion,
  updateCardAnswer,
  requestGetCard,
  openCardSideDock,
  requestAddCardAttachment
} from 'actions/cards';
import { canEditCard } from 'utils/card';
import CardContent from './CardContent';

const mapStateToProps = (state) => {
  const {
    cards: { activeCard },
    profile: { user }
  } = state;

  const {
    _id,
    question,
    answerModel,
    status,
    attachments,
    slackThreadConvoPairs,
    slackReplies,
    externalLinkAnswer,
    isEditing,
    edits,
    hasLoaded,
    isGettingCard,
    getError
  } = activeCard;

  const canEdit = canEditCard(user, activeCard);

  return {
    _id,
    question,
    answerModel,
    status,
    attachments,
    slackThreadConvoPairs,
    slackReplies,
    externalLinkAnswer,
    isEditing: isEditing && canEdit,
    edits,
    hasLoaded,
    isGettingCard,
    getError
  };
};

const mapDispatchToProps = {
  openCardModal,
  updateCardQuestion,
  updateCardAnswer,
  requestGetCard,
  openCardSideDock,
  requestAddCardAttachment
};

export default connect(mapStateToProps, mapDispatchToProps)(CardContent);

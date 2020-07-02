import { connect } from 'react-redux';
import {
  openCardModal,
  updateCardQuestion,
  updateCardAnswer,
  requestGetCard,
  openCardSideDock,
  requestAddCardAttachment
} from 'actions/cards';
import CardContent from './CardContent';

const mapStateToProps = (state) => {
  const {
    cards: {
      activeCard: {
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
      }
    }
  } = state;

  return {
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

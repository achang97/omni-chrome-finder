import { connect } from 'react-redux';
import {
  enableCardEditor,
  adjustCardDescriptionSectionHeight,
  openCardModal,
  updateCardQuestion,
  updateCardDescriptionEditor,
  updateCardAnswerEditor,
  requestGetCard,
  openCardSideDock,
  requestAddCardAttachment
} from 'actions/cards';
import CardContent from './CardContent';

const mapStateToProps = (state) => {
  const {
    profile: { user },
    cards: {
      activeCard: {
        _id,
        question,
        descriptionEditorState,
        answerEditorState,
        status,
        tags,
        attachments,
        slackThreadConvoPairs,
        slackReplies,
        outOfDateReason,
        isEditing,
        edits,
        editorEnabled,
        descriptionSectionHeight,
        hasLoaded,
        isGettingCard,
        getError
      },
      cardsHeight,
      cardsWidth
    }
  } = state;

  return {
    user,
    cardsHeight,
    cardsWidth,
    _id,
    question,
    descriptionEditorState,
    answerEditorState,
    status,
    tags,
    attachments,
    slackThreadConvoPairs,
    slackReplies,
    outOfDateReason,
    isEditing,
    edits,
    editorEnabled,
    descriptionSectionHeight,
    hasLoaded,
    isGettingCard,
    getError
  };
};

const mapDispatchToProps = {
  enableCardEditor,
  adjustCardDescriptionSectionHeight,
  openCardModal,
  updateCardQuestion,
  updateCardDescriptionEditor,
  updateCardAnswerEditor,
  requestGetCard,
  openCardSideDock,
  requestAddCardAttachment
};

export default connect(mapStateToProps, mapDispatchToProps)(CardContent);

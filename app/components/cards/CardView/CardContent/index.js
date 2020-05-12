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
    cards: {
      activeCard: {
        _id,
        question,
        descriptionEditorState,
        answerEditorState,
        status,
        attachments,
        slackThreadConvoPairs,
        slackReplies,
        isEditing,
        edits,
        editorEnabled,
        descriptionSectionHeight,
        hasLoaded,
        isGettingCard,
        getError
      },
      cardsHeight
    }
  } = state;

  return {
    cardsHeight,
    _id,
    question,
    descriptionEditorState,
    answerEditorState,
    status,
    attachments,
    slackThreadConvoPairs,
    slackReplies,
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

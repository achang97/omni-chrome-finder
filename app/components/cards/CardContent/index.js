import { connect } from 'react-redux';
import {
  enableCardEditor,
  adjustCardDescriptionSectionHeight,
  openCardModal,
  cancelEditCard,
  updateCardQuestion,
  updateCardDescriptionEditor,
  updateCardAnswerEditor,
  requestGetCard,
  requestUpdateCard,
  openCardSideDock,
  closeCardSideDock,
  requestToggleUpvote,
  requestAddBookmark,
  requestRemoveBookmark
} from 'actions/cards';
import { MODAL_TYPE } from 'appConstants/card';
import CardContent from './CardContent';

const mapStateToProps = (state) => {
  const {
    profile: { user },
    cards: {
      activeCard: {
        hasLoaded,
        _id,
        question,
        editorEnabled,
        descriptionEditorState,
        answerEditorState,
        answer,
        attachments,
        tags,
        upvotes,
        outOfDateReason,
        status,
        slackThreadConvoPairs,
        slackReplies,
        selectedMessages,
        createdAt,
        lastVerified,
        lastEdited,
        descriptionSectionHeight,
        isEditing,
        edits,
        isGettingCard,
        isUpdatingCard,
        isTogglingUpvote,
        isUpdatingBookmark,
        getError,
        sideDockOpen,
        modalOpen: {
          [MODAL_TYPE]: isConfirmCloseModalOpen
        }
      },
      cardsHeight,
      cardsWidth
    },
    screenRecording: { activeId: activeScreenRecordingId }
  } = state;

  return {
    user,
    cardsHeight,
    cardsWidth,
    activeScreenRecordingId,
    hasLoaded,
    _id,
    question,
    editorEnabled,
    descriptionEditorState,
    answerEditorState,
    answer,
    attachments,
    tags,
    upvotes,
    outOfDateReason,
    status,
    slackThreadConvoPairs,
    slackReplies,
    selectedMessages,
    createdAt,
    lastVerified,
    lastEdited,
    descriptionSectionHeight,
    isEditing,
    edits,
    isGettingCard,
    isUpdatingCard,
    isTogglingUpvote,
    isUpdatingBookmark,
    getError,
    sideDockOpen,
    isConfirmCloseModalOpen
  };
};

const mapDispatchToProps = {
  enableCardEditor,
  adjustCardDescriptionSectionHeight,
  openCardModal,
  cancelEditCard,
  updateCardQuestion,
  updateCardDescriptionEditor,
  updateCardAnswerEditor,
  requestGetCard,
  requestUpdateCard,
  openCardSideDock,
  closeCardSideDock,
  requestToggleUpvote,
  requestAddBookmark,
  requestRemoveBookmark
};

export default connect(mapStateToProps, mapDispatchToProps)(CardContent);

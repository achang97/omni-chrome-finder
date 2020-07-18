import { connect } from 'react-redux';
import {
  requestToggleUpvote,
  requestToggleSubscribe,
  requestAddBookmark,
  requestRemoveBookmark,
  openCardModal,
  requestUpdateCard,
  editCard,
  cancelEditCard
} from 'actions/cards';
import { cardStateChanged, canEditCard, hasValidEdits } from 'utils/card';
import CardFooter from './CardFooter';

const mapStateToProps = (state) => {
  const {
    profile: { user },
    screenRecording: { activeId: activeScreenRecordingId },
    cards: { activeCard }
  } = state;

  const {
    _id,
    status,
    upvotes,
    subscribers,
    owners,
    tags,
    outOfDateReason,
    edits,
    isUpdatingBookmark,
    isUpdatingCard,
    isEditing,
    isTogglingUpvote,
    isTogglingSubscribe
  } = activeCard;

  const hasCardChanged = cardStateChanged(activeCard);
  const canEdit = canEditCard(user, activeCard);

  return {
    user,
    canEdit,
    hasValidEdits: hasValidEdits(activeCard),
    activeScreenRecordingId,
    _id,
    status,
    tags,
    upvotes,
    subscribers,
    owners,
    outOfDateReason,
    edits,
    isUpdatingBookmark,
    isUpdatingCard,
    isEditing: isEditing && canEdit,
    isTogglingUpvote,
    isTogglingSubscribe,
    hasCardChanged
  };
};

const mapDispatchToProps = {
  requestToggleUpvote,
  requestToggleSubscribe,
  requestAddBookmark,
  requestRemoveBookmark,
  openCardModal,
  requestUpdateCard,
  editCard,
  cancelEditCard
};

export default connect(mapStateToProps, mapDispatchToProps)(CardFooter);

import { connect } from 'react-redux';
import {
  requestToggleUpvote,
  requestAddBookmark,
  requestRemoveBookmark,
  openCardModal,
  requestUpdateCard,
  editCard,
  cancelEditCard
} from 'actions/cards';
import trackEvent from 'actions/analytics';
import { cardStateChanged } from 'utils/card';
import CardFooter from './CardFooter';

const mapStateToProps = (state) => {
  const {
    profile: { user },
    screenRecording: { activeId: activeScreenRecordingId },
    cards: { activeCard }
  } = state;

  const {
    _id,
    question,
    status,
    upvotes,
    tags,
    outOfDateReason,
    edits,
    isUpdatingBookmark,
    isUpdatingCard,
    isEditing,
    isTogglingUpvote
  } = activeCard;

  const hasCardChanged = cardStateChanged(activeCard);

  return {
    user,
    activeScreenRecordingId,
    _id,
    question,
    status,
    tags,
    upvotes,
    outOfDateReason,
    edits,
    isUpdatingBookmark,
    isUpdatingCard,
    isEditing,
    isTogglingUpvote,
    hasCardChanged
  };
};

const mapDispatchToProps = {
  requestToggleUpvote,
  requestAddBookmark,
  requestRemoveBookmark,
  openCardModal,
  requestUpdateCard,
  editCard,
  cancelEditCard,
  trackEvent
};

export default connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(CardFooter);

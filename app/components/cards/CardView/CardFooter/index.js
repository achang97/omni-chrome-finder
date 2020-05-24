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
import { cardStateChanged, isExternalCard } from 'utils/card';
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
    isExternal: isExternalCard(activeCard),
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
  cancelEditCard
};

export default connect(mapStateToProps, mapDispatchToProps)(CardFooter);

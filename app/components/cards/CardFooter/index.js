import { connect } from 'react-redux';
import {
  requestToggleUpvote,
  requestAddBookmark,
  requestRemoveBookmark,
  openCardModal,
  requestUpdateCard,
  editCard
} from 'actions/cards';
import CardFooter from './CardFooter';

const mapStateToProps = (state) => {
  const {
    profile: { user },
    screenRecording: { activeId: activeScreenRecordingId },
    cards: {
      activeCard: {
        _id,
        status,
        upvotes,
        edits,
        isUpdatingBookmark,
        isUpdatingCard,
        isEditing,
        isTogglingUpvote
      }
    }
  } = state;

  return {
    user,
    activeScreenRecordingId,
    _id,
    status,
    upvotes,
    edits,
    isUpdatingBookmark,
    isUpdatingCard,
    isEditing,
    isTogglingUpvote
  };
};

const mapDispatchToProps = {
  requestToggleUpvote,
  requestAddBookmark,
  requestRemoveBookmark,
  openCardModal,
  requestUpdateCard,
  editCard
};

export default connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(CardFooter);

import { connect } from 'react-redux';
import * as cardActions from 'actions/cards';
import CardContent from './CardContent';

const mapStateToProps = (state) => {
  const {
    profile: { user },
    cards: { activeCard, cardsHeight, cardsWidth, activeCardIndex },
    screenRecording: { activeId: activeScreenRecordingId }
  } = state;

  return { user, ...activeCard, cardsHeight, cardsWidth, activeCardIndex, activeScreenRecordingId };
};

const mapDispatchToProps = {
  ...cardActions
};

export default connect(mapStateToProps, mapDispatchToProps)(CardContent);

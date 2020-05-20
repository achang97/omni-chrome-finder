import { connect } from 'react-redux';
import { updateSelectedFinderNodes } from 'actions/finder';
import FinderDraggable from './FinderDraggable';

const mapStateToProps = (state, ownProps) => {
  const { finderId } = ownProps;
  const {
    finder: {
      [finderId]: { draggingNode, selectedNodes }
    },
    cards: { windowPosition }
  } = state;

  return { draggingNode, selectedNodes, windowPosition };
};

const mapDispatchToProps = {
  updateSelectedFinderNodes
};

export default connect(mapStateToProps, mapDispatchToProps)(FinderDraggable);

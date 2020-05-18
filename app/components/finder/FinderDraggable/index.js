import { connect } from 'react-redux';
import { updateSelectedFinderNodes } from 'actions/finder';
import FinderDraggable from './FinderDraggable';

const mapStateToProps = (state) => {
  const {
    finder: { selectedNodeIds, draggingNodeId },
    cards: { windowPosition }
  } = state;

  return { selectedNodeIds, windowPosition, draggingNodeId };
};

const mapDispatchToProps = {
  updateSelectedFinderNodes
};

export default connect(mapStateToProps, mapDispatchToProps)(FinderDraggable);
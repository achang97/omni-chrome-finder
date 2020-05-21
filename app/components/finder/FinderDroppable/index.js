import { connect } from 'react-redux';
import { requestMoveFinderNodes, updateDraggingFinderNode } from 'actions/finder';
import FinderDroppable from './FinderDroppable';

const mapStateToProps = (state, ownProps) => {
  const { finderId } = ownProps;
  const {
    finder: {
      [finderId]: { draggingNode, selectedNodes }
    }
  } = state;

  return { isDragging: !!draggingNode, selectedNodes };
};

const mapDispatchToProps = {
  requestMoveFinderNodes,
  updateDraggingFinderNode
};

export default connect(mapStateToProps, mapDispatchToProps)(FinderDroppable);

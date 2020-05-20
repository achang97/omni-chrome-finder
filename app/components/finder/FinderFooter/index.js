import { connect } from 'react-redux';
import _ from 'lodash';
import { cancelMoveFinderNodes, requestMoveFinderNodes } from 'actions/finder';
import FinderFooter from './FinderFooter';

const mapStateToProps = (state, ownProps) => {
  const { finderId } = ownProps;
  const {
    finder: {
      [finderId]: {
        history: finderHistory,
        activeNode,
        moveSource,
        moveNodes,
        selectedNodes,
        isMovingNodes
      }
    }
  } = state;

  const activePath = _.last(finderHistory);
  return { activePath, activeNode, moveNodes, moveSource, selectedNodes, isMovingNodes };
};

const mapDispatchToProps = {
  cancelMoveFinderNodes,
  requestMoveFinderNodes
};

export default connect(mapStateToProps, mapDispatchToProps)(FinderFooter);

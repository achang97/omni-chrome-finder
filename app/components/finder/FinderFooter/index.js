import { connect } from 'react-redux';
import _ from 'lodash';
import { cancelMoveFinderNodes, requestMoveFinderNodes } from 'actions/finder';
import FinderFooter from './FinderFooter';

const mapStateToProps = (state) => {
  const {
    finder: {
      history: finderHistory,
      activeNode,
      moveSource,
      moveNodeIds,
      isMovingNodes
    }
  } = state;

  const activePath = _.last(finderHistory);
  return { activePath, activeNode, moveNodeIds, moveSource, isMovingNodes };
}

const mapDispatchToProps = {
  cancelMoveFinderNodes,
  requestMoveFinderNodes
}

export default connect(mapStateToProps, mapDispatchToProps)(FinderFooter);
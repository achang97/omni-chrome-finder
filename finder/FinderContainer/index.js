import { connect } from 'react-redux';
import { cancelMoveFinderNodes, requestMoveFinderNodes } from 'actions/finder';
import { MAIN_STATE_ID } from 'appConstants/finder';
import FinderContainer from './FinderContainer';

const mapStateToProps = (state) => {
  const {
    finder: {
      [MAIN_STATE_ID]: { moveNodes, moveSource, isMovingNodes }
    }
  } = state;

  return { moveNodes, moveSource, isMovingNodes };
};

const mapDispatchToProps = {
  cancelMoveFinderNodes,
  requestMoveFinderNodes
};

export default connect(mapStateToProps, mapDispatchToProps)(FinderContainer);

import { connect } from 'react-redux';
import FinderFooter from './FinderFooter';

const mapStateToProps = (state, ownProps) => {
  const { finderId } = ownProps;
  const {
    finder: {
      [finderId]: { activeNode, selectedNodes }
    }
  } = state;

  return { activeNode, selectedNodes };
};

export default connect(mapStateToProps)(FinderFooter);

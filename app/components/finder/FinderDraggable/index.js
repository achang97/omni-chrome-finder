import { connect } from 'react-redux';
import FinderDraggable from './FinderDraggable';

const mapStateToProps = (state) => {
  const {
    cards: { windowPosition }
  } = state;

  return { windowPosition };
};

export default connect(mapStateToProps)(FinderDraggable);

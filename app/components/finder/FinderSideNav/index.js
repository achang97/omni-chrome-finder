import { connect } from 'react-redux';
import { pushFinderNode, pushFinderSegment } from 'actions/finder';
import FinderSideNav from './FinderSideNav';

const mapStateToProps = (state) => {
  const {} = state;

  return {};
};

const mapDispatchToProps = {
  pushFinderNode,
  pushFinderSegment
};

export default connect(mapStateToProps, mapDispatchToProps)(FinderSideNav);

import { connect } from 'react-redux';
import _ from 'lodash';
import { pushFinderNode, pushFinderSegment } from 'actions/finder';
import FinderSideNav from './FinderSideNav';

const mapStateToProps = (state) => {
  const {
    finder: { history: finderHistory }
  } = state;

  const activePath = _.last(finderHistory);
  return { activePathId: activePath._id };
};

const mapDispatchToProps = {
  pushFinderNode,
  pushFinderSegment
};

export default connect(mapStateToProps, mapDispatchToProps)(FinderSideNav);

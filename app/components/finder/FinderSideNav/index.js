import { connect } from 'react-redux';
import { pushFinderPath } from 'actions/finder';
import FinderSideNav from './FinderSideNav';

const mapStateToProps = (state) => {
  const {} = state;

  return {};
};

const mapDispatchToProps = {
  pushFinderPath
};

export default connect(mapStateToProps, mapDispatchToProps)(FinderSideNav);

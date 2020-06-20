import { connect } from 'react-redux';
import { openFinder, pushFinderNode } from 'actions/finder';
import trackEvent from 'actions/analytics';
import CardLocation from './CardLocation';

const mapDispatchToProps = {
  openFinder,
  pushFinderNode,
  trackEvent
};

export default connect(undefined, mapDispatchToProps)(CardLocation);

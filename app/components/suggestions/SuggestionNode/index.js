import { connect } from 'react-redux';
import { openFinder, pushFinderNode } from 'actions/finder';
import trackEvent from 'actions/analytics';
import SuggestionNode from './SuggestionNode';

const mapDispatchToProps = {
  openFinder,
  pushFinderNode,
  trackEvent
};

export default connect(undefined, mapDispatchToProps)(SuggestionNode);

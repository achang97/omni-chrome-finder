import { connect } from 'react-redux';
import { openFinder, pushFinderNode } from 'actions/finder';
import SuggestionNode from './SuggestionNode';

const mapDispatchToProps = {
  openFinder,
  pushFinderNode
};

export default connect(undefined, mapDispatchToProps)(SuggestionNode);

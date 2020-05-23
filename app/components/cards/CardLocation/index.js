import { connect } from 'react-redux';
import { openFinder, pushFinderNode } from 'actions/finder';
import CardLocation from './CardLocation';

const mapDispatchToProps = {
  openFinder,
  pushFinderNode
};

export default connect(undefined, mapDispatchToProps)(CardLocation);

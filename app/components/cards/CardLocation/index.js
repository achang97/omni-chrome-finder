import { connect } from 'react-redux';
import { openCardModal, closeCardModal } from 'actions/cards';
import { openFinder, pushFinderNode } from 'actions/finder';
import CardLocation from './CardLocation';

const mapDispatchToProps = {
  openCardModal,
  closeCardModal,
  openFinder,
  pushFinderNode
};

export default connect(undefined, mapDispatchToProps)(CardLocation);

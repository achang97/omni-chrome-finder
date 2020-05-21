import { connect } from 'react-redux';
import { openCardModal, closeCardModal, updateCardFinderNode } from 'actions/cards';
import { closeFinder } from 'actions/finder';
import { MODAL_TYPE } from 'appConstants/card';
import CardFinderModal from './CardFinderModal';

const mapStateToProps = (state) => {
  const {
    cards: {
      activeCard: {
        _id,
        status,
        modalOpen: { [MODAL_TYPE.FINDER]: isOpen },
        edits: { finderNode }
      }
    }
  } = state;

  const startNodeId = finderNode && finderNode._id;
  return { isOpen, status, startNodeId, _id };
};

const mapDispatchToProps = {
  openCardModal,
  closeCardModal,
  updateCardFinderNode,
  closeFinder
};

export default connect(mapStateToProps, mapDispatchToProps)(CardFinderModal);

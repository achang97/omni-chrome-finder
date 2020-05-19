import { connect } from 'react-redux';
import _ from 'lodash';
import { openCardModal, closeCardModal, updateCardPath } from 'actions/cards';
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
        edits: { path }
      }
    }
  } = state;

  const startNode = _.last(path);
  const startNodeId = startNode && startNode._id;
  return { isOpen, status, startNodeId, _id };
};

const mapDispatchToProps = {
  openCardModal,
  closeCardModal,
  updateCardPath,
  closeFinder
};

export default connect(mapStateToProps, mapDispatchToProps)(CardFinderModal);

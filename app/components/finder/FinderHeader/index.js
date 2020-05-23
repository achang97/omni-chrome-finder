import { connect } from 'react-redux';
import _ from 'lodash';
import { withRouter } from 'react-router-dom';
import {
  goBackFinder,
  pushFinderNode,
  updateFinderSearchText,
  openFinderModal,
  startMoveFinderNodes
} from 'actions/finder';
import { openCard, toggleCards } from 'actions/cards';
import { toggleTemplateView, updateCreateFinderNode } from 'actions/create';
import FinderHeader from './FinderHeader';

const mapStateToProps = (state, ownProps) => {
  const { finderId } = ownProps;
  const {
    finder: {
      [finderId]: { history: finderHistory, activeNode, selectedNodes, moveNodes }
    },
    create: { isTemplateView },
    profile: { user }
  } = state;

  const activePath = _.last(finderHistory);
  return {
    isBackDisabled: finderHistory.length <= 1,
    activePath,
    activeNode,
    selectedNodes,
    moveNodes,
    isTemplateView,
    user
  };
};

const mapDispatchToProps = {
  goBackFinder,
  pushFinderNode,
  updateFinderSearchText,
  openFinderModal,
  startMoveFinderNodes,
  openCard,
  toggleCards,
  toggleTemplateView,
  updateCreateFinderNode
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(FinderHeader));
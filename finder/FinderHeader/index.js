import { connect } from 'react-redux';
import _ from 'lodash';
import { withRouter } from 'react-router-dom';
import {
  goBackFinder,
  pushFinderNode,
  updateFinderSearchText,
  updateFinderSearchType,
  openFinderModal,
  startMoveFinderNodes
} from 'actions/finder';
import { openCard, toggleCards } from 'actions/cards';
import trackEvent from 'actions/analytics';
import FinderHeader from './FinderHeader';

const mapStateToProps = (state, ownProps) => {
  const { finderId } = ownProps;
  const {
    finder: {
      [finderId]: { history: finderHistory, activeNode, selectedNodes, moveNodes }
    },
    profile: { user }
  } = state;

  const activePath = _.last(finderHistory);
  return {
    isBackDisabled: finderHistory.length <= 1,
    activePath,
    activeNode,
    selectedNodes,
    moveNodes,
    user
  };
};

const mapDispatchToProps = {
  goBackFinder,
  pushFinderNode,
  updateFinderSearchText,
  updateFinderSearchType,
  openFinderModal,
  startMoveFinderNodes,
  openCard,
  toggleCards,
  trackEvent
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(FinderHeader));

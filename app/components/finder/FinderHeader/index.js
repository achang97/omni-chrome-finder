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
import { toggleTemplateView, updateCreatePath } from 'actions/create';
import FinderHeader from './FinderHeader';

const mapStateToProps = (state) => {
  const {
    finder: {
      history: finderHistory,
      activeNode,
      selectedNodeIds,
      moveNodeIds
    },
    create: { isTemplateView },
    profile: { user }
  } = state;

  const activePath = _.last(finderHistory);
  return {
    isBackDisabled: finderHistory.length <= 1,
    activePath,
    activeNode,
    selectedNodeIds,
    moveNodeIds,
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
  updateCreatePath
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(FinderHeader));

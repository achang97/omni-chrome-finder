import { connect } from 'react-redux';
import _ from 'lodash';
import { withRouter } from 'react-router-dom';
import {
  goBackFinder,
  pushFinderNode,
  updateFinderSearchText,
  openFinderModal
} from 'actions/finder';
import { openCard, toggleCards } from 'actions/cards';
import { toggleTemplateView } from 'actions/create';
import FinderHeader from './FinderHeader';

const mapStateToProps = (state) => {
  const {
    finder: { history: finderHistory, activeNode },
    create: { isTemplateView }
  } = state;

  const activePath = _.last(finderHistory);
  return { isBackDisabled: finderHistory.length <= 1, activePath, activeNode, isTemplateView };
};

const mapDispatchToProps = {
  goBackFinder,
  pushFinderNode,
  updateFinderSearchText,
  openFinderModal,
  openCard,
  toggleCards,
  toggleTemplateView
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(FinderHeader));

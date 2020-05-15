import { connect } from 'react-redux';
import _ from 'lodash';
import { goBackFinder, pushFinderNode, updateFinderSearchText } from 'actions/finder';
import { openCard } from 'actions/cards';
import FinderHeader from './FinderHeader';

const mapStateToProps = (state) => {
  const {
    finder: { history: finderHistory, activeNode, searchText }
  } = state;

  const activePath = _.last(finderHistory);
  return { isBackDisabled: finderHistory.length <= 1, activePath, activeNode, searchText };
};

const mapDispatchToProps = {
  goBackFinder,
  pushFinderNode,
  updateFinderSearchText,
  openCard
};

export default connect(mapStateToProps, mapDispatchToProps)(FinderHeader);

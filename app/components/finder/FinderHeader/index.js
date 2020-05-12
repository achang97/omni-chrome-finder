import { connect } from 'react-redux';
import { goBackFinder, pushFinderPath, updateFinderSearchText } from 'actions/finder';
import { openCard } from 'actions/cards';
import FinderHeader from './FinderHeader';

const mapStateToProps = (state) => {
  const {
    finder: { history: finderHistory, searchText }
  } = state;

  return { finderHistory, searchText };
};

const mapDispatchToProps = {
  goBackFinder,
  pushFinderPath,
  updateFinderSearchText,
  openCard
};

export default connect(mapStateToProps, mapDispatchToProps)(FinderHeader);

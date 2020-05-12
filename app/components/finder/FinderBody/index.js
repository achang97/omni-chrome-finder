import { connect } from 'react-redux';
import {
  pushFinderPath,
  selectFinderNodeIndex,
  toggleSelectedFinderNodeIndex
} from 'actions/finder';
import FinderBody from './FinderBody';

const mapStateToProps = (state) => {
  const {
    finder: { history: finderHistory, searchText, selectedIndices }
  } = state;

  const activePath = finderHistory.length === 0 ? null : finderHistory[finderHistory.length - 1];
  return { activePath, searchText, selectedIndices };
};

const mapDispatchToProps = {
  pushFinderPath,
  selectFinderNodeIndex,
  toggleSelectedFinderNodeIndex
};

export default connect(mapStateToProps, mapDispatchToProps)(FinderBody);

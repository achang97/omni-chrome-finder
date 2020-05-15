import { connect } from 'react-redux';
import _ from 'lodash';
import { requestGetFinderNode } from 'actions/finder';
import { requestSearchCards, clearSearchCards } from 'actions/search';
import FinderView from './FinderView';

const mapStateToProps = (state) => {
  const {
    finder: { history: finderHistory, searchText },
    profile: { user }
  } = state;

  const activePath = _.last(finderHistory);
  return { activePath, searchText, user };
};

const mapDispatchToProps = {
  requestGetFinderNode,
  clearSearchCards,
  requestSearchCards
};

export default connect(mapStateToProps, mapDispatchToProps)(FinderView);

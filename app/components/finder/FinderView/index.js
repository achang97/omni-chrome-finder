import { connect } from 'react-redux';
import _ from 'lodash';
import { requestGetFinderNode } from 'actions/finder';
import { requestSearchCards, clearSearchCards } from 'actions/search';
import { SEARCH } from 'appConstants';
import FinderView from './FinderView';

const mapStateToProps = (state) => {
  const {
    finder: { history: finderHistory },
    profile: {
      user: { _id, bookmarkIds }
    },
    search: {
      cards: {
        [SEARCH.TYPE.FINDER]: {
          hasReachedLimit: hasReachedSegmentLimit, isSearchingCards: isSearchingSegment
        }
      }
    }
  } = state;

  const activePath = _.last(finderHistory);
  return {
    activePath,
    hasReachedSegmentLimit,
    isSearchingSegment,
    ownUserId: _id,
    bookmarkIds
  };
};

const mapDispatchToProps = {
  requestGetFinderNode,
  clearSearchCards,
  requestSearchCards
};

export default connect(mapStateToProps, mapDispatchToProps)(FinderView);

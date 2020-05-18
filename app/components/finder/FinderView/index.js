import { connect } from 'react-redux';
import _ from 'lodash';
import { requestGetFinderNode, updateSelectedFinderNodes, updateDraggingFinderNode } from 'actions/finder';
import { requestSearchCards, clearSearchCards } from 'actions/search';
import { SEARCH } from 'appConstants';
import FinderView from './FinderView';

const mapStateToProps = (state) => {
  const {
    finder: { history: finderHistory, selectedNodeIds },
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
    selectedNodeIds,
    hasReachedSegmentLimit,
    isSearchingSegment,
    ownUserId: _id,
    bookmarkIds
  };
};

const mapDispatchToProps = {
  requestGetFinderNode,
  clearSearchCards,
  requestSearchCards,
  updateSelectedFinderNodes,
  updateDraggingFinderNode
};

export default connect(mapStateToProps, mapDispatchToProps)(FinderView);

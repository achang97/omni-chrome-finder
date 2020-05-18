import { connect } from 'react-redux';
import _ from 'lodash';
import { requestGetFinderNode, updateSelectedFinderNodes, updateDraggingFinderNode } from 'actions/finder';
import { requestSearchCards, clearSearchCards } from 'actions/search';
import { SEARCH, FINDER } from 'appConstants';
import FinderView from './FinderView';

const mapStateToProps = (state) => {
  const {
    finder: { history: finderHistory, selectedNodeIds, activeNode },
    profile: {
      user: { _id, bookmarkIds }
    },
    search: {
      cards: {
        [SEARCH.TYPE.FINDER]: {
          hasReachedLimit: hasReachedSegmentLimit, isSearchingCards: isSearchingSegment, cards
        }
      }
    }
  } = state;

  const activePath = _.last(finderHistory);
  let nodes = [];
  switch (activePath.type) {
    case FINDER.PATH_TYPE.NODE: {
      nodes = activeNode.children;
      break;
    }
    case FINDER.PATH_TYPE.SEGMENT: {
      nodes = cards.map((card) => ({ _id: card._id, card }));
      break;
    }
    default:
      break;
  }

  return {
    activePath,
    selectedNodeIds,
    nodes,
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

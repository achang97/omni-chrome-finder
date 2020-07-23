import { connect } from 'react-redux';
import _ from 'lodash';
import {
  initFinder,
  requestGetFinderNode,
  updateSelectedFinderNodes,
  updateDraggingFinderNode
} from 'actions/finder';
import { requestSearchCards, clearSearchCards } from 'actions/search';
import { SEARCH, FINDER } from 'appConstants';
import FinderView from './FinderView';

const mapStateToProps = (state, ownProps) => {
  const { finderId = FINDER.MAIN_STATE_ID } = ownProps;
  const {
    finder: { [finderId]: finderState = {} },
    profile: {
      user: { _id, bookmarkIds }
    },
    search: {
      cards: {
        [SEARCH.SOURCE.SEGMENT]: {
          hasReachedLimit: hasReachedSegmentLimit,
          isSearchingCards: isSearchingSegment,
          cards
        }
      }
    }
  } = state;

  const { history: finderHistory = [], selectedNodes = [], activeNode } = finderState;
  const activePath = _.last(finderHistory);

  let nodes = [];
  if (activePath) {
    switch (activePath.type) {
      case FINDER.PATH_TYPE.NODE: {
        nodes = activeNode.children;
        break;
      }
      case FINDER.PATH_TYPE.SEGMENT: {
        nodes = cards.map((card) => ({ finderType: FINDER.FINDER_TYPE.CARD, ...card }));
        break;
      }
      default:
        break;
    }
  }

  return {
    activePath,
    hasLoaded: !!_.get(activeNode, '_id'),
    selectedNodes,
    nodes,
    hasReachedSegmentLimit,
    isSearchingSegment,
    ownUserId: _id,
    bookmarkIds
  };
};

const mapDispatchToProps = {
  initFinder,
  requestGetFinderNode,
  clearSearchCards,
  requestSearchCards,
  updateSelectedFinderNodes,
  updateDraggingFinderNode
};

export default connect(mapStateToProps, mapDispatchToProps)(FinderView);

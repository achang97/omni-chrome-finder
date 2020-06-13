import { connect } from 'react-redux';
import _ from 'lodash';
import {
  pushFinderNode,
  openFinderModal,
  updateFinderFolderName,
  updateFinderFolderPermissions,
  updateFinderFolderPermissionGroups
} from 'actions/finder';
import { openCard } from 'actions/cards';
import { SEARCH } from 'appConstants';
import FinderBody from './FinderBody';

const mapStateToProps = (state, ownProps) => {
  const { finderId } = ownProps;
  const {
    finder: {
      [finderId]: { history: finderHistory, isGettingNode, isMovingNodes, selectedNodes, moveNodes }
    },
    search: {
      cards: {
        [SEARCH.SOURCE.SEGMENT]: {
          isSearchingCards: isSearchingSegment,
          page: segmentPage,
          hasReachedLimit: hasReachedSegmentLimit
        }
      }
    }
  } = state;

  const activePath = _.last(finderHistory);
  return {
    isGettingNode,
    isMovingNodes,
    isSearchingSegment,
    segmentPage,
    hasReachedSegmentLimit,
    activePath,
    selectedNodes,
    moveNodes
  };
};

const mapDispatchToProps = {
  pushFinderNode,
  openFinderModal,
  openCard,
  updateFinderFolderName,
  updateFinderFolderPermissions,
  updateFinderFolderPermissionGroups
};

export default connect(mapStateToProps, mapDispatchToProps)(FinderBody);

import { connect } from 'react-redux';
import _ from 'lodash';
import {
  pushFinderNode,
  openFinderModal,
  updateSelectedFinderNodes,
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
      [finderId]: {
        history: finderHistory,
        isGettingNode,
        selectedNodeIds,
        moveNodeIds,
        draggingNodeId
      }
    },
    search: {
      cards: {
        [SEARCH.TYPE.FINDER]: { isSearchingCards: isSearchingSegment, page: segmentPage }
      }
    }
  } = state;

  const activePath = _.last(finderHistory);
  return {
    isGettingNode,
    isSearchingSegment,
    segmentPage,
    activePath,
    selectedNodeIds,
    moveNodeIds,
    draggingNodeId
  };
};

const mapDispatchToProps = {
  pushFinderNode,
  openFinderModal,
  updateSelectedFinderNodes,
  openCard,
  updateFinderFolderName,
  updateFinderFolderPermissions,
  updateFinderFolderPermissionGroups
};

export default connect(mapStateToProps, mapDispatchToProps)(FinderBody);

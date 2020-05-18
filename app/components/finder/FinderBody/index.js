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
import { SEARCH, FINDER } from 'appConstants';
import FinderBody from './FinderBody';

const mapStateToProps = (state) => {
  const {
    finder: {
      history: finderHistory,
      isGettingNode,
      activeNode,
      selectedNodeIds,
      moveNodeIds
    },
    search: {
      cards: {
        [SEARCH.TYPE.FINDER]: { isSearchingCards: isSearchingSegment, page: segmentPage, cards }
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
    isGettingNode,
    isSearchingSegment,
    segmentPage,
    nodes,
    activePath,
    selectedNodeIds,
    moveNodeIds
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

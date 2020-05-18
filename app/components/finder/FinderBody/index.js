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
      selectedNodeIds,
      moveNodeIds
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

import { connect } from 'react-redux';
import _ from 'lodash';
import {
  pushFinderNode,
  selectFinderNodeIndex,
  toggleSelectedFinderNodeIndex
} from 'actions/finder';
import { openCard } from 'actions/cards';
import { SEARCH, FINDER } from 'appConstants';
import FinderBody from './FinderBody';

const mapStateToProps = (state) => {
  const {
    finder: { history: finderHistory, isGettingNode, activeNode, searchText, selectedIndices },
    search: {
      cards: {
        [SEARCH.TYPE.FINDER]: { isSearchingCards, cards }
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
      nodes = cards.map((card) => ({ card }));
      break;
    }
    default:
      break;
  }

  const isLoading = !!(isGettingNode || isSearchingCards);
  return { isLoading, nodes, searchText, selectedIndices };
};

const mapDispatchToProps = {
  pushFinderNode,
  selectFinderNodeIndex,
  toggleSelectedFinderNodeIndex,
  openCard
};

export default connect(mapStateToProps, mapDispatchToProps)(FinderBody);

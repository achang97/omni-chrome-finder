import { connect } from 'react-redux';
import * as navigateActions from 'actions/navigate';
import { requestSearchCards, clearSearchCards } from 'actions/search';
import { SEARCH } from 'appConstants';
import Navigate from './Navigate';

const mapStateToProps = (state) => {
  const {
    navigate: { searchText, activeTab, filterTags, isDeletingCard, deleteError },
    search: {
      cards: {
        [SEARCH.TYPE.NAVIGATE]: { cards, isSearchingCards, hasReachedLimit }
      }
    },
    profile: { user }
  } = state;

  return {
    searchText,
    activeTab,
    filterTags,
    isDeletingCard,
    deleteError,
    cards,
    isSearchingCards,
    hasReachedLimit,
    user
  };
};

const mapDispatchToProps = {
  ...navigateActions,
  requestSearchCards,
  clearSearchCards
};

export default connect(mapStateToProps, mapDispatchToProps)(Navigate);

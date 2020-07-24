import { connect } from 'react-redux';
import { requestSearchCards } from 'actions/search';
import { SEARCH } from 'appConstants';
import Autofind from './Autofind';

const mapStateToProps = (state) => {
  const {
    search: {
      cards: {
        [SEARCH.SOURCE.AUTOFIND]: { cards, searchLogId, isSearchingCards, hasReachedLimit }
      }
    }
  } = state;

  return { cards, isSearchingCards, hasReachedLimit, searchLogId };
};

const mapDispatchToProps = {
  requestSearchCards
};

export default connect(mapStateToProps, mapDispatchToProps)(Autofind);

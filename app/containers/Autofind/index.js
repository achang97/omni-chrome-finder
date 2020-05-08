import { connect } from 'react-redux';
import { requestSearchCards } from 'actions/search';
import { SEARCH } from 'appConstants';
import Autofind from './Autofind';

const mapStateToProps = (state) => {
  const {
    search: {
      cards: {
        [SEARCH.TYPE.AUTOFIND]: { cards, isSearchingCards, hasReachedLimit }
      }
    }
  } = state;

  return { cards, isSearchingCards, hasReachedLimit };
};

const mapDispatchToProps = {
  requestSearchCards
};

export default connect(mapStateToProps, mapDispatchToProps)(Autofind);

import { connect } from 'react-redux';
import { requestSearchCards } from 'actions/search';
import { SEARCH } from 'appConstants';
import AISuggest from './AISuggest';

const mapStateToProps = state => {
  const {
    search: {
      cards: {
        [SEARCH.TYPE.AI_SUGGEST]: {
          cards, isSearchingCards, hasReachedLimit
        }
      }
    }
  } = state;
  
  return { cards, isSearchingCards, hasReachedLimit };
}

const mapDispatchToProps = {
  requestSearchCards,
}

export default connect(mapStateToProps, mapDispatchToProps)(AISuggest);
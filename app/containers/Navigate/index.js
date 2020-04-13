import { connect } from 'react-redux';
import * as navigateActions from 'actions/navigate';
import { requestSearchCards, clearSearchCards } from 'actions/search';
import { SEARCH } from 'appConstants';
import Navigate from './Navigate';

const mapStateToProps = state => {
  const {
    navigate,
    search: {
      cards: {
        [SEARCH.TYPE.NAVIGATE]: navigateCards
      }
    },
    profile: {
      user
    }
  } = state;

  return { ...navigate, ...navigateCards, user }
}

const mapDispatchToProps = {
  ...navigateActions,
  requestSearchCards,
  clearSearchCards,  
}

export default connect(mapStateToProps, mapDispatchToProps)(Navigate);

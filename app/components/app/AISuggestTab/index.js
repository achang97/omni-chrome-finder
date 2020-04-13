import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { toggleDock } from 'actions/display';
import { SEARCH } from 'appConstants';
import AISuggestTab from './AISuggestTab';

const mapStateToProps = (state) => {
  const { 
    search: {
      cards: {
        [SEARCH.TYPE.AI_SUGGEST]: {
          cards
        }
      }
    }
  } = state;

  return { numCards: cards.length }
}

const mapDispatchToProps = {
  toggleDock
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AISuggestTab));



import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { toggleDock } from 'actions/display';
import { SEARCH } from 'appConstants';
import ToggleTab from './ToggleTab';

const mapStateToProps = (state) => {
  const { 
    search: {
      cards: {
        [SEARCH.TYPE.AI_SUGGEST]: {
          cards
        }
      }
    },
    display: {
      showToggleTab
    }
  } = state;

  return { numCards: cards.length, showToggleTab }
}

const mapDispatchToProps = {
  toggleDock
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ToggleTab));



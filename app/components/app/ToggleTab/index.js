import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { toggleDock, hideToggleTab } from 'actions/display';
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
      dockVisible,
      toggleTabShown
    }
  } = state;

  return { numCards: cards.length, toggleTabShown, dockVisible }
}

const mapDispatchToProps = {
  toggleDock,
  hideToggleTab
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ToggleTab));



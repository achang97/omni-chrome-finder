import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { toggleDock, hideToggleTab, toggleAutofindTab, } from 'actions/display';
import { SEARCH } from 'appConstants';
import ToggleTab from './ToggleTab';

const mapStateToProps = (state) => {
  const { 
    search: {
      cards: {
        [SEARCH.TYPE.AUTOFIND]: {
          cards
        }
      }
    },
    display: {
      dockVisible,
      autofindShown,
      toggleTabShown,
    }
  } = state;

  return { numCards: cards.length, toggleTabShown, autofindShown, dockVisible }
}

const mapDispatchToProps = {
  toggleDock,
  hideToggleTab,
  toggleAutofindTab
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ToggleTab));



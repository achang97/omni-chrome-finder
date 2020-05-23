import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  toggleDock,
  hideToggleTab,
  toggleAutofindTab,
  updateToggleTabPosition
} from 'actions/display';
import { SEARCH } from 'appConstants';
import ToggleTab from './ToggleTab';

const mapStateToProps = (state) => {
  const {
    search: {
      cards: {
        [SEARCH.TYPE.AUTOFIND]: { cards }
      }
    },
    display: { dockVisible, autofindShown, toggleTabShown, toggleTabY }
  } = state;

  return { numCards: cards.length, toggleTabShown, autofindShown, dockVisible, toggleTabY };
};

const mapDispatchToProps = {
  toggleDock,
  hideToggleTab,
  toggleAutofindTab,
  updateToggleTabPosition
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ToggleTab));

import { connect } from 'react-redux';
import { toggleDock } from 'actions/display';
import { requestGetUser } from 'actions/profile';
import { requestGetTasks } from 'actions/tasks';
import { openCard } from 'actions/cards';
import { SEARCH } from 'appConstants';

import App from './App';

const mapStateToProps = (state) => {
  const {
    display: { dockVisible, onlyShowSearchBar },
    auth: { token },
    profile: { user },
    search: {
      cards: {
        [SEARCH.SOURCE.AUTOFIND]: { cards }
      }
    }
  } = state;

  return {
    dockVisible,
    onlyShowSearchBar,
    isLoggedIn: !!token,
    user,
    showAutofind: cards.length !== 0
  };
};

const mapDispatchToProps = {
  toggleDock,
  requestGetUser,
  requestGetTasks,
  openCard
};

export default connect(mapStateToProps, mapDispatchToProps)(App);

import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { toggleSearchBar, toggleDock, minimizeSearchBar } from 'actions/display';
import { updateAskSearchText } from 'actions/ask';
import trackEvent from 'actions/analytics';
import SearchBar from './SearchBar';

const mapStateToProps = (state) => {
  const {
    display: { onlyShowSearchBar, dockVisible, toggleTabShown, windowUrl },
    ask: { searchText },
    profile: { user }
  } = state;

  return {
    windowUrl,
    onlyShowSearchBar,
    searchText,
    dockVisible,
    toggleTabShown,
    user
  };
};

const mapDispatchToProps = {
  toggleSearchBar,
  toggleDock,
  updateAskSearchText,
  minimizeSearchBar,
  trackEvent
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SearchBar));

import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { toggleSearchBar, toggleDock, minimizeSearchBar } from 'actions/display';
import { updateAskSearchText } from 'actions/ask';
import SearchBar from './SearchBar';

const mapStateToProps = (state) => {
  const {
    display: { onlyShowSearchBar },
    ask: { searchText }
  } = state;

  return { onlyShowSearchBar, searchText };
};

const mapDispatchToProps = {
  toggleSearchBar,
  toggleDock,
  updateAskSearchText,
  minimizeSearchBar
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SearchBar));
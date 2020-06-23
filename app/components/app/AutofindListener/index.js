import { connect } from 'react-redux';
import { requestSearchCards, clearSearchCards } from 'actions/search';
import AutofindListener from './AutofindListener';

const mapStateToProps = (state) => {
  const {
    profile: { user },
    display: { windowUrl }
  } = state;

  const { autofindPermissions } = user;
  return { autofindPermissions, windowUrl };
};

const mapDispatchToProps = {
  requestSearchCards,
  clearSearchCards
};

export default connect(mapStateToProps, mapDispatchToProps)(AutofindListener);

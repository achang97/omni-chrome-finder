import { connect } from 'react-redux';
import { requestSearchCards, clearSearchCards } from 'actions/search';
import { isValidUser } from 'utils/auth';
import AutofindListener from './AutofindListener';

const mapStateToProps = (state) => {
  const {
    profile: { user = {} },
    auth: { token }
  } = state;

  const { autofindPermissions = {} } = user;
  return { autofindPermissions, isValidUser: isValidUser(token, user) };
};

const mapDispatchToProps = {
  requestSearchCards,
  clearSearchCards
};

export default connect(mapStateToProps, mapDispatchToProps)(AutofindListener);

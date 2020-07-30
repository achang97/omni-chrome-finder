import { connect } from 'react-redux';
import { requestGetUser } from 'actions/profile';
import { logout } from 'actions/auth';
import Profile from './Profile';

const mapStateToProps = (state) => {
  const {
    profile: { user }
  } = state;

  return { user };
};

const mapDispatchToProps = {
  requestGetUser,
  logout
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);

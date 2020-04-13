import { connect } from 'react-redux';
import PrivateRoute from './PrivateRoute';

const mapStateToProps = (state) => {
  const { 
    auth: {
      token
    },
    profile: {
      user
    }
  } = state;

  return { isLoggedIn: !!token, isVerified: user && user.isVerified };
}

export default connect(mapStateToProps)(PrivateRoute);

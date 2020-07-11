import { connect } from 'react-redux';
import { hasCompletedOnboarding } from 'utils/auth';
import PrivateRoute from './PrivateRoute';

const mapStateToProps = (state) => {
  const {
    auth: { token },
    profile: { user = {} }
  } = state;

  return {
    isLoggedIn: !!token,
    isVerified: !!user.isVerified,
    isDisabled: !!(user.company && user.company.disabled),
    hasCompletedOnboarding: !!(user && hasCompletedOnboarding(user.onboarding))
  };
};

export default connect(mapStateToProps)(PrivateRoute);

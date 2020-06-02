import { connect } from 'react-redux';
import { logout } from 'actions/auth';
import { requestGetUser } from 'actions/profile';
import { URL, WEB_APP_ROUTES, PROFILE } from 'appConstants';
import CompleteOnboarding from './CompleteOnboarding';

const mapStateToProps = (state) => {
  const {
    auth: { isGettingUser },
    profile: {
      user: {
        onboarding: { member, admin },
        role
      }
    },
    display: { dockVisible }
  } = state;

  const currSection = role === PROFILE.USER_ROLE.MEMBER ? member : admin;
  const url = `${URL.WEB_APP}${WEB_APP_ROUTES.ONBOARDING}/${role.toLowerCase()}/${currSection}`;

  return {
    dockVisible,
    isGettingUser,
    url
  };
};

const mapDispatchToProps = {
  logout,
  requestGetUser
};

export default connect(mapStateToProps, mapDispatchToProps)(CompleteOnboarding);

import { connect } from 'react-redux';
import { logout } from 'actions/auth';
import { requestGetUser } from 'actions/profile';
import { URL, WEB_APP_ROUTES, USER } from 'appConstants';
import CompleteOnboarding from './CompleteOnboarding';

const mapStateToProps = (state) => {
  const {
    auth: { isGettingUser },
    profile: {
      user: { onboarding, role }
    },
    display: { dockVisible }
  } = state;

  const onboardingType =
    role === USER.ROLE.ADMIN ? USER.ONBOARDING.TYPE.ADMIN : USER.ONBOARDING.TYPE.MEMBER;

  const url = `${URL.WEB_APP}${WEB_APP_ROUTES.ONBOARDING}/${onboardingType}/${onboarding[onboardingType]}`;

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

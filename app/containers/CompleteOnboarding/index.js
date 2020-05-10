import { connect } from 'react-redux';
import { logout } from 'actions/auth';
import { requestGetUser } from 'actions/profile';
import { ONBOARDING_COMPLETE, ONBOARDING_SECTION } from 'appConstants/profile';
import CompleteOnboarding from './CompleteOnboarding';

const mapStateToProps = (state) => {
  const {
    auth: { isGettingUser },
    profile: {
      user: {
        onboarding: { extension }
      }
    },
    display: { dockVisible }
  } = state;

  const sections = [ONBOARDING_SECTION.CREATE_CARDS, ONBOARDING_SECTION.INTEGRATIONS];
  const currSection = sections.find((section) => extension[section] !== ONBOARDING_COMPLETE);

  return {
    dockVisible,
    isGettingUser,
    onboardingSection: currSection,
    onboardingSubsection: extension[currSection]
  };
};

const mapDispatchToProps = {
  logout,
  requestGetUser
};

export default connect(mapStateToProps, mapDispatchToProps)(CompleteOnboarding);

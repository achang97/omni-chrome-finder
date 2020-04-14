import { connect } from 'react-redux';
import { logout } from 'actions/auth';
import { requestGetUser } from 'actions/profile';
import CompleteOnboarding from './CompleteOnboarding';

const ONBOARDING_COMPLETE = -1;

const mapStateToProps = state => {
  const {
    auth: {
      isGettingUser
    },
    profile: {
      user: {
        onboarding: {
          extension
        }
      }
    }
  } = state;

  let onboardingSection, onboardingSubsection;
  if (extension.createCards !== ONBOARDING_COMPLETE) {
    onboardingSection = 1;
    onboardingSubsection = extension.createCards;
  } else if (extension.search !== ONBOARDING_COMPLETE) {
    onboardingSection = 2;
    onboardingSubsection = extension.search;
  } else if (extension.screenRecord !== ONBOARDING_COMPLETE) {
    onboardingSection = 3;
    onboardingSubsection = extension.screenRecord;
  } else if (extension.integrations !== ONBOARDING_COMPLETE) {
    onboardingSection = 4;
    onboardingSubsection = extension.integrations;
  }

  return { isGettingUser, onboardingSection, onboardingSubsection };
}

const mapDispatchToProps = {
  logout,
  requestGetUser
}

export default connect(mapStateToProps, mapDispatchToProps)(CompleteOnboarding);
import { connect } from 'react-redux';
import { logout } from 'actions/auth';
import { requestGetUser } from 'actions/profile';
import { ONBOARDING_COMPLETE } from 'appConstants/profile';
import CompleteOnboarding from './CompleteOnboarding';

const ONBOARDING_SECTION = {
  CREATE_CARDS: 'createCards',
  SEARCH: 'search',
  SCREEN_RECORD: 'screenRecord',
  INTEGRATIONS: 'integrations'
};

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

  const sections = [
    ONBOARDING_SECTION.CREATE_CARDS,
    ONBOARDING_SECTION.SEARCH,
    ONBOARDING_SECTION.SCREEN_RECORD,
    ONBOARDING_SECTION.INTEGRATIONS
  ];

  const section = sections.find((section) => extension[section] !== ONBOARDING_COMPLETE);
  return {
    dockVisible,
    isGettingUser,
    onboardingSection: section,
    onboardingSubsection: extension[section]
  };
};

const mapDispatchToProps = {
  logout,
  requestGetUser
};

export default connect(mapStateToProps, mapDispatchToProps)(CompleteOnboarding);

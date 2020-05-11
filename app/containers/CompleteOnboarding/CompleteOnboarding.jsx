import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import AuthView from 'components/auth/AuthView';
import { Loader } from 'components/common';
import { URL, WEB_APP_ROUTES, PROFILE } from 'appConstants';

import { getStyleApplicationFn } from 'utils/style';

const s = getStyleApplicationFn();

const CompleteOnboarding = ({
  dockVisible,
  isGettingUser,
  onboardingSection,
  onboardingSubsection,
  logout,
  requestGetUser
}) => {
  useEffect(() => {
    if (dockVisible) {
      requestGetUser();
    }
  }, [dockVisible, requestGetUser]);

  const onboardingUrl = `${URL.WEB_APP}${WEB_APP_ROUTES.ONBOARDING}/${onboardingSection}/${onboardingSubsection}`;
  return (
    <AuthView
      // title="Complete Onboarding"
      subtitle="Please complete onboarding before using the chrome extension"
      inputBody={
        <div className={s('flex justify-center')}>
          <div
            className={s('text-gray-dark text-xs cursor-pointer mr-sm')}
            onClick={requestGetUser}
          >
            Already completed onboarding? Click to refresh
          </div>
          {isGettingUser && <Loader size="xs" />}
        </div>
      }
      submitButtonProps={{
        text: 'Complete Onboarding',
        onClick: () => window.open(onboardingUrl)
      }}
      footer={
        <div className={s('cursor-pointer text-xs text-right')} onClick={logout}>
          Logout
        </div>
      }
    />
  );
};

CompleteOnboarding.propTypes = {
  dockVisible: PropTypes.bool.isRequired,
  isGettingUser: PropTypes.bool,
  onboardingSection: PropTypes.oneOf(Object.values(PROFILE.ONBOARDING_SECTION)).isRequired,
  onboardingSubsection: PropTypes.number.isRequired,

  // Redux Actions
  logout: PropTypes.func.isRequired,
  requestGetUser: PropTypes.func.isRequired
};

CompleteOnboarding.defaultProps = {
  isGettingUser: false
};

export default CompleteOnboarding;

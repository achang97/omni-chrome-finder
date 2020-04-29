import React, { useEffect } from 'react';
import AuthView from 'components/auth/AuthView';
import { URL, WEB_APP_ROUTES } from 'appConstants';

import { getStyleApplicationFn } from 'utils/style';
const s = getStyleApplicationFn();

const CompleteOnboarding = ({
  dockVisible, isGettingUser, onboardingSection, onboardingSubsection,
  logout, requestGetUser
}) => {
  useEffect(() => {
    if (dockVisible && !isGettingUser) {
      requestGetUser();
    }
  }, [dockVisible]);

  const onboardingUrl = `${URL.WEB_APP}${WEB_APP_ROUTES.ONBOARDING}/${onboardingSection}/${onboardingSubsection}`;
  return (
    <AuthView
      //title="Complete Onboarding"
      subtitle="Please complete onboarding before using the chrome extension"
      inputBody={
        <div className={s('flex justify-center')}>
          <div className={s('text-gray-dark text-xs cursor-pointer mr-sm')} onClick={requestGetUser}>
            Already completed onboarding? Click to refresh
          </div>
          { isGettingUser &&
            <Loader size="xs" />            
          }
        </div>  
      }
      submitButtonProps={{
        text: 'Complete Onboarding',
        onClick: () => window.open(onboardingUrl),
      }}
      footer={
        <div className={s('cursor-pointer text-xs text-right')} onClick={logout}>
          Logout
        </div>   
      }
    />
  );
}
export default CompleteOnboarding;
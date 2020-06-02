import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import AuthView from 'components/auth/AuthView';
import { Loader } from 'components/common';

import { getStyleApplicationFn } from 'utils/style';

const s = getStyleApplicationFn();

const CompleteOnboarding = ({ dockVisible, isGettingUser, url, logout, requestGetUser }) => {
  useEffect(() => {
    if (dockVisible) {
      requestGetUser();
    }
  }, [dockVisible, requestGetUser]);

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
        onClick: () => window.open(url)
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
  url: PropTypes.string.isRequired,

  // Redux Actions
  logout: PropTypes.func.isRequired,
  requestGetUser: PropTypes.func.isRequired
};

CompleteOnboarding.defaultProps = {
  isGettingUser: false
};

export default CompleteOnboarding;

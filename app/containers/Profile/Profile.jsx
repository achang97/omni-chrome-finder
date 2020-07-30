import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { IntegrationsSection, InfoSection } from 'components/profile';

import { UserPropTypes } from 'utils/propTypes';
import { getStyleApplicationFn } from 'utils/style';

const s = getStyleApplicationFn();

const Profile = ({ user, requestGetUser, logout, location: { state = {} } }) => {
  const { startOpenSettingsSection } = state;

  useEffect(() => {
    requestGetUser();
  }, [requestGetUser]);

  return (
    <div className={s('flex flex-col py-lg min-h-0 flex-grow')}>
      <InfoSection />
      <IntegrationsSection startOpen={startOpenSettingsSection} />
      <div className={s('flex justify-between pt-reg px-lg')}>
        <div className={s('text-sm text-gray-dark')}> {user.email} </div>
        <div
          className={s('text-sm text-purple-reg underline cursor-pointer')}
          onClick={() => logout()}
        >
          Logout
        </div>
      </div>
    </div>
  );
};

Profile.propTypes = {
  // Redux State
  user: UserPropTypes.isRequired,

  // Redux Actions
  requestGetUser: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired
};

export default Profile;

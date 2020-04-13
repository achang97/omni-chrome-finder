import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md';

import { Button, Dropdown, Loader } from 'components/common';
import { getIntegrationAuthLink, isLoggedIn } from 'utils/auth';

import { colors } from 'styles/colors';
import style from './integration-auth-button.css';
import { getStyleApplicationFn } from 'utils/style';

const s = getStyleApplicationFn(style);

const IntegrationAuthButton = ({ integration, user, token, isLoading, error, requestLogoutUserIntegration }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const onSignIn = () => {
    const authLink = getIntegrationAuthLink(user._id, token, integration);
    window.open(authLink, 'popup', 'width=600,height=600');
  }

  const onSignOut = () => {
    setDropdownOpen(false);
    requestLogoutUserIntegration(integration);
  }

  if (isLoggedIn(user, integration)) {
    return (
      <div className={s('flex-shrink-0 relative')}>
        <Dropdown
          className={s('ml-xs')}
          isOpen={dropdownOpen}
          toggler={
            <Button
              text="Connected"
              color="secondary"
              className={s('text-green-reg bg-green-xlight p-reg shadow-none')}
              icon={isLoading ?
                <Loader size="sm" className={s('ml-reg')} /> :
                <MdKeyboardArrowDown className={s('ml-reg')} />
              }
              iconLeft={false}
            />
          }
          onToggle={dropdownOpen => setDropdownOpen(dropdownOpen)}
          body={
            <div className={s('integration-auth-sign-out-dropdown')}>
              <Button
                text="Sign Out"
                className={'shadow-none text-purple-reg py-sm px-reg'}
                onClick={onSignOut}
              />
            </div>
          }
        />
      </div>
    );
  } else {
    return (
      <Button
        text="Sign In"
        color="transparent"
        className={s('p-reg')}
        onClick={onSignIn}
      />
    );
  }
}

IntegrationAuthButton.propTypes = {
  integration: PropTypes.string.isRequired,
};

IntegrationAuthButton.defaultProps = {
};

export default IntegrationAuthButton;

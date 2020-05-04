import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md';

import { Button, Dropdown, Loader } from 'components/common';
import { getIntegrationAuthLink, isLoggedIn } from 'utils/auth';

import { colors } from 'styles/colors';
import style from './integration-auth-button.css';
import { getStyleApplicationFn } from 'utils/style';

const s = getStyleApplicationFn(style);

const IntegrationAuthButton = ({
  integration: { type, title, logo }, showIntegration,
  user, token, isLoading, error, requestLogoutUserIntegration
}) => {
  const authWindow = useRef(null);
  const loggedIn = isLoggedIn(user, type);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const onSignIn = () => {
    const authLink = getIntegrationAuthLink(user._id, token, type);
    authWindow.current = window.open(authLink, 'popup', 'width=600,height=600');
  }

  useEffect(() => {
    if (loggedIn) {
      if (authWindow.current) authWindow.current.close();
    }
  }, [loggedIn]);

  const onSignOut = () => {
    setDropdownOpen(false);
    requestLogoutUserIntegration(type);
  }

  let textSuffix = '';
  let icon;
  if (showIntegration) {
    textSuffix = `to ${title}`;
    icon = <img className="h-xl mr-sm" src={logo} />;
  }

  if (loggedIn) {
    return (
      <div className={s('flex-shrink-0 relative')}>
        <Dropdown
          className={s('ml-xs')}
          isOpen={dropdownOpen}
          toggler={
            <Button
              text={`Connected${textSuffix}`}
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
                icon={icon}
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
        text={`Sign In${textSuffix}`}
        color="transparent"
        icon={icon}
        className={s('p-reg')}
        onClick={onSignIn}
      />
    );
  }
}

IntegrationAuthButton.propTypes = {
  integration: PropTypes.string.isRequired,
  showIntegration: PropTypes.bool,
};

IntegrationAuthButton.defaultProps = {
  showIntegration: true,
};

export default IntegrationAuthButton;

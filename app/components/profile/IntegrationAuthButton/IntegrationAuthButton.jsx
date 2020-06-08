import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { MdKeyboardArrowDown } from 'react-icons/md';

import { Button, Dropdown, Loader, ConfirmModal } from 'components/common';
import { getIntegrationAuthLink, isLoggedIn } from 'utils/auth';
import { UserPropTypes } from 'utils/propTypes';
import { INTEGRATIONS } from 'appConstants';

import { getStyleApplicationFn } from 'utils/style';
import style from './integration-auth-button.css';

const s = getStyleApplicationFn(style);

const IntegrationAuthButton = ({
  integration: { type, title, logo },
  showIntegration,
  onWindowOpen,
  className,
  user,
  token,
  isLoading,
  requestLogoutUserIntegration
}) => {
  const [authWindow, setAuthWindow] = useState(null);
  const loggedIn = isLoggedIn(user, type);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Integration Specific
  const [isModalOpen, setModalOpen] = useState(false);
  const [zendeskHost, setZendeskHost] = useState('');

  const openAuthWindow = (queryParams) => {
    const authLink = getIntegrationAuthLink(user._id, token, type, queryParams);
    const newWindow = window.open(authLink, 'popup', 'width=600,height=600');

    setAuthWindow(newWindow);
    if (onWindowOpen) onWindowOpen(newWindow);
  };

  const onSignIn = () => {
    switch (type) {
      case INTEGRATIONS.ZENDESK.type: {
        setModalOpen(true);
        break;
      }
      default: {
        openAuthWindow();
        break;
      }
    }
  };

  useEffect(() => {
    if (loggedIn && authWindow) {
      authWindow.close();
      setAuthWindow(null);
    }
  }, [loggedIn]);

  const onSignOut = () => {
    setDropdownOpen(false);
    requestLogoutUserIntegration(type);
  };

  const getModalProps = () => {
    switch (type) {
      case INTEGRATIONS.ZENDESK.type: {
        return {
          title: 'Sign into Zendesk',
          body: (
            <input
              placeholder="Account Host (i.e. help.addomni.com)"
              className={s('w-full')}
              value={zendeskHost}
              onChange={(e) => setZendeskHost(e.target.value)}
            />
          ),
          primaryButtonProps: {
            text: 'Sign In',
            onClick: () => {
              openAuthWindow({ subdomain: zendeskHost });
              setModalOpen(false);
              setZendeskHost('');
            },
            disabled: zendeskHost === ''
          }
        };
      }
      default: {
        return {};
      }
    }
  };

  let textSuffix = '';
  let icon;
  if (showIntegration) {
    textSuffix = ` to ${title}`;
    icon = <img className={s('h-xl mr-sm')} src={logo} alt={title} />;
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
              className={s(`text-green-reg bg-green-xlight p-reg shadow-none ${className}`)}
              icon={
                isLoading ? (
                  <Loader size="sm" className={s('ml-reg')} />
                ) : (
                  <MdKeyboardArrowDown className={s('ml-reg')} />
                )
              }
              iconLeft={false}
            />
          }
          onToggle={(isOpen) => setDropdownOpen(isOpen)}
          body={
            <div className={s('integration-auth-sign-out-dropdown')}>
              <Button
                text="Sign Out"
                icon={icon}
                className={s('shadow-none text-purple-reg py-sm px-reg')}
                onClick={onSignOut}
              />
            </div>
          }
        />
      </div>
    );
  }
  return (
    <>
      <Button
        text={`Sign In${textSuffix}`}
        color="transparent"
        icon={icon}
        className={s(`p-reg ${className}`)}
        onClick={onSignIn}
      />
      <ConfirmModal
        shouldCloseOnOutsideClick
        isOpen={!!isModalOpen}
        showSecondary={false}
        onRequestClose={() => setModalOpen(false)}
        {...getModalProps()}
      />
    </>
  );
};

IntegrationAuthButton.propTypes = {
  integration: PropTypes.shape({
    type: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    logo: PropTypes.string.isRequired
  }).isRequired,
  showIntegration: PropTypes.bool,
  onWindowOpen: PropTypes.func,
  className: PropTypes.string,

  // Redux State
  user: UserPropTypes.isRequired,
  token: PropTypes.string.isRequired,
  isLoading: PropTypes.bool,

  // Redux Actions
  requestLogoutUserIntegration: PropTypes.func.isRequired
};

IntegrationAuthButton.defaultProps = {
  showIntegration: true,
  onWindowOpen: null,
  className: ''
};

export default IntegrationAuthButton;

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
  const [hostUrl, setHostUrl] = useState('');
  const [isAtlassianServer, setAtlassianServer] = useState(false);

  const resetState = () => {
    setModalOpen(false);
    setHostUrl('');
    setAtlassianServer(false);
  };

  const openAuthWindow = (queryParams) => {
    const authLink = getIntegrationAuthLink(user._id, token, type, queryParams);
    const newWindow = window.open(authLink, 'popup', 'width=600,height=600');

    setAuthWindow(newWindow);

    // Unset everything here
    resetState();
    if (onWindowOpen) onWindowOpen(newWindow);
  };

  const onSignIn = () => {
    switch (type) {
      case INTEGRATIONS.ZENDESK.type:
      case INTEGRATIONS.CONFLUENCE.type:
      case INTEGRATIONS.JIRA.type: {
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
  }, [loggedIn, authWindow]);

  const onSignOut = () => {
    setDropdownOpen(false);
    requestLogoutUserIntegration(type);
  };

  const getHostUrlInput = (placeholder) => (
    <input
      placeholder={placeholder}
      className={s('w-full')}
      value={hostUrl}
      onChange={(e) => setHostUrl(e.target.value)}
      autoFocus
    />
  );

  const getModalProps = () => {
    switch (type) {
      case INTEGRATIONS.ZENDESK.type: {
        return {
          title: 'Sign into Zendesk',
          body: getHostUrlInput('Account Host (i.e. addomni.zendesk.com)'),
          primaryButtonProps: {
            onClick: () => openAuthWindow({ subdomain: hostUrl })
          }
        };
      }
      case INTEGRATIONS.CONFLUENCE.type:
      case INTEGRATIONS.JIRA.type: {
        return {
          title: `Sign into ${title}`,
          body: !isAtlassianServer ? (
            <>
              <div className={s('text-sm mb-reg')}>
                Contact your site admin to see which solution {user.company.companyName} uses.
              </div>
              <Button color="secondary" text={`${title} Cloud`} onClick={openAuthWindow} />
              <Button
                color="transparent"
                className={s('mt-sm')}
                text={`${title} Server`}
                onClick={() => setAtlassianServer(true)}
              />
              <a
                href="https://addomnihelp.zendesk.com/hc/en-us/articles/360010492158"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className={s('text-blue-500 text-xs mt-reg text-center')}>
                  How to set up {title} Server with Omni
                </div>
              </a>
            </>
          ) : (
            getHostUrlInput(`Site Url (i.e. addomni.${type}.com)`)
          ),
          showPrimary: isAtlassianServer,
          primaryButtonProps: {
            onClick: () => openAuthWindow({ siteUrl: hostUrl })
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

  const { primaryButtonProps, ...restModalProps } = getModalProps();
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
        onRequestClose={resetState}
        primaryButtonProps={{
          text: 'Sign In',
          disabled: hostUrl === '',
          ...primaryButtonProps
        }}
        {...restModalProps}
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

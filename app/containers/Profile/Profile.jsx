import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import AnimateHeight from 'react-animate-height';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { MdKeyboardArrowDown, MdKeyboardArrowUp, MdEdit } from 'react-icons/md';
import Toggle from 'react-toggle';

import { Button, Message, Separator, Loader } from 'components/common';
import { IntegrationAuthButton, ProfilePicture } from 'components/profile';

import { PROFILE, INTEGRATIONS } from 'appConstants';
import { UserPropTypes } from 'utils/propTypes';

import { colors } from 'styles/colors';
import { getStyleApplicationFn } from 'utils/style';

import GmailIcon from 'assets/images/icons/Gmail_Icon.svg';
import GoogleChromeIcon from 'assets/images/icons/GoogleChrome_Icon.svg';
import style from './profile.css';

const s = getStyleApplicationFn(style);

const PROFILE_NOTIFICATIONS_OPTIONS = [
  { type: 'email', title: 'Email', logo: GmailIcon },
  INTEGRATIONS.SLACK,
  { type: 'chrome', title: 'Chrome', logo: GoogleChromeIcon }
];

const PROFILE_SETTING_SECTIONS = [
  {
    type: PROFILE.SETTING_SECTION_TYPE.INTEGRATIONS,
    title: 'Integrations',
    options: [INTEGRATIONS.GOOGLE, INTEGRATIONS.ZENDESK, INTEGRATIONS.GMAIL, INTEGRATIONS.SLACK],
    startOpen: true,
    toggle: false
  },
  {
    type: PROFILE.SETTING_SECTION_TYPE.AUTOFIND,
    title: 'Autofind Permissions',
    options: [
      INTEGRATIONS.GMAIL,
      { ...INTEGRATIONS.ZENDESK, disabled: true },
      { ...INTEGRATIONS.SALESFORCE, disabled: true },
      { ...INTEGRATIONS.HUBSPOT, disabled: true },
      { ...INTEGRATIONS.JIRA, disabled: true },
      { ...INTEGRATIONS.HELPSCOUT, disabled: true }
    ],
    startOpen: false,
    toggle: true
  },
  {
    type: PROFILE.SETTING_SECTION_TYPE.NOTIFICATIONS,
    title: 'Notification Permissions',
    options: PROFILE_NOTIFICATIONS_OPTIONS,
    startOpen: false,
    toggle: true
  }
];

const PROGRESS_BAR_STYLES = {
  // How long animation takes to go from one percentage to another, in seconds
  pathTransitionDuration: 0.5,

  // Colors
  textColor: colors.purple.reg,
  pathColor: colors.purple.reg
};

const Profile = ({
  user,
  userEdits,
  analytics,
  permissionState,
  isUpdatingUser,
  isEditingAbout,
  changeFirstname,
  changeLastname,
  changeBio,
  requestUpdateUser,
  editUser,
  requestGetUser,
  requestUpdateUserPermissions,
  logout
}) => {
  const [sectionOpen, setSectionOpen] = useState({
    [PROFILE.SETTING_SECTION_TYPE.INTEGRATIONS]: true,
    [PROFILE.SETTING_SECTION_TYPE.AUTOFIND]: false,
    [PROFILE.SETTING_SECTION_TYPE.NOTIFICATIONS]: false
  });

  useEffect(() => {
    requestGetUser();
  }, [requestGetUser]);

  const renderAboutSection = () => {
    return (
      <div className={s('flex flex-col')}>
        {isUpdatingUser ? (
          <Loader />
        ) : (
          <div className={s('flex')}>
            <ProfilePicture isEditable={isEditingAbout} />
            <div className={s('flex flex-1 flex-col min-w-0 ml-reg')}>
              {!isEditingAbout && (
                <div className={s('flex mt-xs text-sm text-purple-reg')}>
                  <div className={s('flex-1')}>
                    {user.companyName} • {user.role}
                  </div>
                  <div className={s('cursor-pointer flex')} onClick={editUser}>
                    <MdEdit />
                    <span className={s('ml-xs text-gray-reg')}> Edit </span>
                  </div>
                </div>
              )}
              {isEditingAbout ? (
                <div>
                  <div className={s('flex')}>
                    <input
                      placeholder="First Name"
                      className={s(
                        'profile-about-input flex-grow mr-sm min-w-0 flex-1 cursor-text'
                      )}
                      value={userEdits.firstname}
                      onChange={(e) => changeFirstname(e.target.value)}
                    />
                    <input
                      placeholder="Last Name"
                      className={s(
                        'profile-about-input flex-grow ml-sm min-w-0 flex-1 cursor-text'
                      )}
                      value={userEdits.lastname}
                      onChange={(e) => changeLastname(e.target.value)}
                    />
                  </div>
                  <input
                    placeholder="Bio (eg. Support Manager @ Pied Piper)"
                    className={s('profile-about-input w-full min-w-0 flex-1 mt-reg cursor-text')}
                    value={userEdits.bio}
                    onChange={(e) => changeBio(e.target.value)}
                  />
                </div>
              ) : (
                <div>
                  <div className={s('text-reg font-semibold mt-xs')}>
                    {user.firstname} {user.lastname}
                  </div>
                  <div className={s('text-sm text-gray-dark mt-sm')}> {user.bio}</div>
                </div>
              )}
            </div>
          </div>
        )}
        {isEditingAbout && (
          <Button
            text="Save Changes"
            className={s('bg-purple-light text-purple-reg mt-reg')}
            onClick={() => requestUpdateUser(userEdits)}
          />
        )}
      </div>
    );
  };

  const renderMetricsSection = () => {
    const { count = 0, upToDateCount } = analytics;
    let upToDatePercentage = 0;
    let upToDatePercentageText = '--';

    if (count !== 0) {
      upToDatePercentage = Math.floor((upToDateCount / count) * 100);
      upToDatePercentageText = `${upToDatePercentage}%`;
    }

    return (
      <div className={s('flex justify-between bg-white shadow-light p-reg mt-reg rounded-lg')}>
        <div>
          <div className={s('text-xl text-purple-reg font-semibold')}>{upToDatePercentageText}</div>
          <div className={s('text-sm text-purple-reg mt-sm')}> Cards up to date</div>
        </div>
        <CircularProgressbar
          className={s('w-4xl h-4xl')}
          value={upToDatePercentage}
          text={upToDatePercentageText}
          styles={buildStyles(PROGRESS_BAR_STYLES)}
        />
      </div>
    );
  };

  const renderIntegrations = (integrationSection) => {
    const { type, toggle, options } = integrationSection;
    const { autofindPermissions, notificationPermissions } = user;

    return (
      <div>
        {options.map((integration, i) => {
          const { type: optionType, title, logo, disabled } = integration;
          return (
            <div
              key={title}
              className={s(
                `flex bg-white p-reg justify-between border border-solid border-gray-xlight items-center rounded-lg ${
                  i > 0 ? 'mt-sm' : ''
                }`
              )}
            >
              <div className={s('flex flex-1 items-center')}>
                <div className={s('profile-integration-img-container')}>
                  <img src={logo} className={s('profile-integration-img')} alt={title} />
                </div>
                <div className={s('flex-1 text-sm')}> {title} </div>
              </div>
              {disabled && (
                <span className={s('text-xs italic text-gray-light mx-sm')}>Coming soon!</span>
              )}
              {toggle ? (
                <Toggle
                  checked={
                    !disabled &&
                    (type === PROFILE.SETTING_SECTION_TYPE.AUTOFIND
                      ? autofindPermissions[optionType]
                      : notificationPermissions[optionType])
                  }
                  disabled={disabled}
                  icons={false}
                  onChange={() => requestUpdateUserPermissions(type, optionType)}
                />
              ) : (
                <IntegrationAuthButton integration={integration} showIntegration={false} />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const toggleIntegrationSection = (type) => {
    setSectionOpen({ ...sectionOpen, [type]: !sectionOpen[type] });
  };

  const renderIntegrationsSection = () => {
    return (
      <div className={s('flex flex-col overflow-auto flex-grow px-lg py-sm')}>
        {PROFILE_SETTING_SECTIONS.map((profileSettingSection, i) => {
          const { type, title, toggle } = profileSettingSection;
          const isOpen = sectionOpen[type];
          const Icon = isOpen ? MdKeyboardArrowUp : MdKeyboardArrowDown;
          const { error, isLoading } = permissionState[type] || {};

          return (
            <div
              key={title}
              className={s(
                `profile-integration-container ${
                  isOpen
                    ? 'profile-integration-container-active'
                    : 'profile-integration-container-inactive'
                } ${i !== 0 ? 'mt-reg' : ''}`
              )}
            >
              <div
                className={s(`py-sm flex items-center justify-between ${isOpen ? 'mb-sm' : ''}`)}
                onClick={() => toggleIntegrationSection(type)}
              >
                <div className={s('text-purple-reg text-sm')}>{title}</div>
                <div className={s('flex items-center')}>
                  {toggle && isLoading && <Loader size="xs" className={s('mr-sm')} />}
                  <Icon className={s('text-gray-dark cursor-pointer')} />
                </div>
              </div>
              <AnimateHeight
                height={isOpen ? 'auto' : 0}
                animationStateClasses={{ animatingUp: s('invisible') }}
              >
                {renderIntegrations(profileSettingSection)}
              </AnimateHeight>
              <Message className={s('my-sm')} message={error} type="error" show={toggle} />
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className={s('flex flex-col py-lg min-h-0 flex-grow')}>
      <div className={s('flex flex-col px-lg')}>
        {renderAboutSection()}
        {renderMetricsSection()}
        <Separator horizontal className={s('my-reg')} />
      </div>
      {renderIntegrationsSection()}
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
  userEdits: PropTypes.shape({
    firstname: PropTypes.string,
    lastname: PropTypes.string,
    bio: PropTypes.string
  }).isRequired,
  analytics: PropTypes.shape({
    count: PropTypes.number.isRequired,
    upToDateCount: PropTypes.number.isRequired
  }).isRequired,
  permissionState: PropTypes.objectOf(
    PropTypes.shape({
      error: PropTypes.string,
      isLoading: PropTypes.bool
    })
  ).isRequired,
  isUpdatingUser: PropTypes.bool,
  isEditingAbout: PropTypes.bool.isRequired,

  // Redux Actions
  changeFirstname: PropTypes.func.isRequired,
  changeLastname: PropTypes.func.isRequired,
  changeBio: PropTypes.func.isRequired,
  requestUpdateUser: PropTypes.func.isRequired,
  editUser: PropTypes.func.isRequired,
  requestGetUser: PropTypes.func.isRequired,
  requestUpdateUserPermissions: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired
};

Profile.defaultProps = {
  isUpdatingUser: false
};

export default Profile;

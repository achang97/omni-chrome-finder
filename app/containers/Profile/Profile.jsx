import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { MdEdit } from 'react-icons/md';

import { Button, Separator, Loader, CheckBox } from 'components/common';
import { SettingsSection, ProfilePicture } from 'components/profile';

import { PROFILE, USER, INTEGRATIONS, URL } from 'appConstants';
import { UserPropTypes } from 'utils/propTypes';

import { colors } from 'styles/colors';
import { getStyleApplicationFn } from 'utils/style';

import GmailIcon from 'assets/images/icons/Gmail_Icon.svg';
import GoogleChromeIcon from 'assets/images/icons/GoogleChrome_Icon.svg';
import style from './profile.css';

const s = getStyleApplicationFn(style);

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
  isSavingEdits,
  isEditingAbout,
  changeFirstname,
  changeLastname,
  changeBio,
  requestSaveUserEdits,
  requestUpdateUser,
  editUser,
  requestGetUser,
  requestUpdateUserPermissions,
  logout,
  location: { state = {} }
}) => {
  const { startOpenSettingsSection = PROFILE.SETTING_SECTION_TYPE.INTEGRATIONS } = state;

  const settingSectionRefs = useRef([]);

  useEffect(() => {
    const numSections = Object.keys(PROFILE.SETTING_SECTION_TYPE).length;
    settingSectionRefs.current = [...Array(numSections).fill(null)];
  }, []);

  useEffect(() => {
    requestGetUser();
  }, [requestGetUser]);

  const PROFILE_SETTING_SECTIONS = [
    {
      sectionType: PROFILE.SETTING_SECTION_TYPE.INTEGRATIONS,
      title: 'Integrations',
      options: USER.INTEGRATIONS,
      type: 'authButton'
    },
    {
      sectionType: PROFILE.SETTING_SECTION_TYPE.AUTOFIND,
      title: 'Autofind Permissions',
      options: [
        INTEGRATIONS.GMAIL
        // INTEGRATIONS.HELPSCOUT,
        // INTEGRATIONS.HUBSPOT,
        // INTEGRATIONS.JIRA,
        // INTEGRATIONS.SALESFORCE,
        // INTEGRATIONS.ZENDESK
      ],
      extendOption: ({ type }) => ({
        isToggledOn: user.autofindPermissions[type],
        disabled: type !== INTEGRATIONS.GMAIL.type
      }),
      type: 'toggle'
    },
    {
      sectionType: PROFILE.SETTING_SECTION_TYPE.EXTERNAL_VERIFICATION,
      title: 'External Verification',
      options: [
        INTEGRATIONS.CONFLUENCE,
        INTEGRATIONS.DROPBOX,
        INTEGRATIONS.GOOGLE,
        INTEGRATIONS.NOTION,
        INTEGRATIONS.TETTRA,
        INTEGRATIONS.ZENDESK
      ],
      extendOption: ({ type }) => ({
        isToggledOn: !user.widgetSettings.externalLink.disabledIntegrations.includes(type),
        disabled: user.widgetSettings.externalLink.disabled
      }),
      type: 'toggle',
      footer: (
        <div className={s('flex items-center mt-reg')}>
          <CheckBox
            isSelected={user.widgetSettings.externalLink.disabled}
            toggleCheckbox={() => {
              requestUpdateUser({
                widgetSettings: {
                  ...user.widgetSettings,
                  externalLink: {
                    ...user.widgetSettings.externalLink,
                    disabled: !user.widgetSettings.externalLink.disabled
                  }
                }
              });
            }}
            className={s('flex-shrink-0 mr-reg')}
          />
          <div className={s('text-sm text-gray-dark')}> Disable All </div>
        </div>
      )
    },
    {
      sectionType: PROFILE.SETTING_SECTION_TYPE.SEARCH_BAR,
      title: 'Search Bar',
      options: [
        INTEGRATIONS.CONFLUENCE,
        // INTEGRATIONS.GOOGLE,
        INTEGRATIONS.JIRA,
        INTEGRATIONS.SLACK,
        INTEGRATIONS.ZENDESK
      ],
      extendOption: ({ type }) => ({ isToggledOn: !user.widgetSettings.searchBar[type].disabled }),
      type: 'toggle'
    },
    {
      sectionType: PROFILE.SETTING_SECTION_TYPE.NOTIFICATIONS,
      title: 'Notification Permissions',
      options: [
        { type: 'chrome', title: 'Chrome', logo: GoogleChromeIcon },
        { type: 'email', title: 'Email', logo: GmailIcon },
        INTEGRATIONS.SLACK
      ],
      extendOption: ({ type }) => ({ isToggledOn: user.notificationPermissions[type] }),
      type: 'toggle'
    }
  ];

  const renderAboutSection = () => {
    return (
      <div className={s('flex flex-col')}>
        {isSavingEdits ? (
          <Loader />
        ) : (
          <div className={s('flex')}>
            <ProfilePicture isEditable={isEditingAbout} />
            <div className={s('flex flex-1 flex-col min-w-0 ml-reg')}>
              {!isEditingAbout && (
                <div className={s('flex mt-xs text-sm text-purple-reg')}>
                  <div className={s('flex-1')}>
                    {user.company.name} • {user.role}
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
            onClick={requestSaveUserEdits}
          />
        )}
      </div>
    );
  };

  const renderDashboardButton = () => {
    if (user.role !== USER.ROLE.ADMIN) {
      return null;
    }

    return (
      <a href={URL.WEB_APP} target="_blank" rel="noreferrer noopener" className={s('mt-sm')}>
        <Button
          className={s('py-sm')}
          textClassName={s('text-xs')}
          color="primary"
          text="Open Admin Dashboard"
        />
      </a>
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
      <div className={s('flex justify-between bg-white shadow-light p-reg mt-sm rounded-lg')}>
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

  const renderIntegrationsSection = () => {
    return (
      <div className={s('flex flex-col overflow-auto flex-grow px-lg py-sm')}>
        <div className={s('mb-sm text-gray-reg text-sm')}> Profile Settings </div>
        {PROFILE_SETTING_SECTIONS.map((section, i) => {
          const { sectionType, type, title, options, extendOption, footer } = section;
          const { error, isLoading } = permissionState[type] || {};

          const setRef = (ref) => {
            if (!settingSectionRefs.current[i] && sectionType === startOpenSettingsSection && ref) {
              ref.scrollIntoView();
            }

            if (ref) {
              settingSectionRefs.current[i] = ref;
            }
          };

          return (
            <SettingsSection
              ref={(ref) => setRef(ref)}
              key={title}
              title={title}
              type={type}
              startOpen={startOpenSettingsSection === sectionType}
              onToggleOption={(optionType) => requestUpdateUserPermissions(sectionType, optionType)}
              options={options.map((option) => ({
                ...option,
                ...(extendOption && extendOption(option))
              }))}
              error={error}
              isLoading={isLoading}
              className={s(i === 0 ? '' : 'mt-sm')}
              footer={footer}
            />
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
        {renderDashboardButton()}
        <Separator horizontal className={s('mt-reg')} />
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
  isSavingEdits: PropTypes.bool,
  isEditingAbout: PropTypes.bool.isRequired,

  // Redux Actions
  changeFirstname: PropTypes.func.isRequired,
  changeLastname: PropTypes.func.isRequired,
  changeBio: PropTypes.func.isRequired,
  requestSaveUserEdits: PropTypes.func.isRequired,
  requestUpdateUser: PropTypes.func.isRequired,
  editUser: PropTypes.func.isRequired,
  requestGetUser: PropTypes.func.isRequired,
  requestUpdateUserPermissions: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired
};

Profile.defaultProps = {
  isSavingEdits: false
};

export default Profile;

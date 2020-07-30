import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { CheckBox } from 'components/common';
import { PROFILE, USER, INTEGRATIONS } from 'appConstants';

import GmailIcon from 'assets/images/icons/Gmail_Icon.svg';
import GoogleChromeIcon from 'assets/images/icons/GoogleChrome_Icon.svg';
import { getStyleApplicationFn } from 'utils/style';

import SettingsSection from '../SettingsSection';

const s = getStyleApplicationFn();

const IntegrationsSection = ({
  startOpen,
  user,
  permissionState,
  requestUpdateUser,
  requestUpdateUserPermissions
}) => {
  const settingSectionRefs = useRef([]);
  useEffect(() => {
    const numSections = Object.keys(PROFILE.SETTING_SECTION_TYPE).length;
    settingSectionRefs.current = [...Array(numSections).fill(null)];
  }, []);

  const PROFILE_SETTING_SECTIONS = [
    {
      sectionType: PROFILE.SETTING_SECTION_TYPE.INTEGRATIONS,
      title: 'Integrations',
      options: USER.INTEGRATIONS,
      type: 'authButton',
      extendOption: ({ type }) => {
        if (type !== INTEGRATIONS.SALESFORCE.type) {
          return null;
        }

        return {
          footer:
            "Usage of Salesforce's search API is available only for Developer, Professional, and Enterprise accounts."
        };
      }
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

  const renderIntegrationsSection = () => {
    return (
      <div className={s('flex flex-col overflow-auto flex-grow px-lg py-sm')}>
        <div className={s('mb-sm text-gray-reg text-sm')}> Profile Settings </div>
        {PROFILE_SETTING_SECTIONS.map((section, i) => {
          const { sectionType, type, title, options, extendOption, footer } = section;
          const { error, isLoading } = permissionState[type] || {};

          const setRef = (ref) => {
            if (!settingSectionRefs.current[i] && sectionType === startOpen && ref) {
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
              startOpen={startOpen === sectionType}
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

  return renderIntegrationsSection();
};

IntegrationsSection.propTypes = {
  startOpen: PropTypes.oneOf(Object.values(PROFILE.SETTING_SECTION_TYPE)),

  // Redux State
  permissionState: PropTypes.objectOf(
    PropTypes.shape({
      error: PropTypes.string,
      isLoading: PropTypes.bool
    })
  ).isRequired,

  // Redux Actions
  requestUpdateUser: PropTypes.func.isRequired,
  requestUpdateUserPermissions: PropTypes.func.isRequired
};

IntegrationsSection.defaultProps = {
  startOpen: PROFILE.SETTING_SECTION_TYPE.INTEGRATIONS
};

export default IntegrationsSection;

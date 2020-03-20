import React, { Component, PropTypes } from 'react';
import AnimateHeight from 'react-animate-height';
import Button from '../../components/common/Button';
import CheckBox from '../../components/common/CheckBox';
import PlaceholderImg from '../../components/common/PlaceholderImg';
import Dropdown from '../../components/common/Dropdown';
import IntegrationAuthButton from '../../components/profile/IntegrationAuthButton';

import { logout } from '../../actions/auth';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { MdEdit } from 'react-icons/md';
import { USER_PERMISSION_TYPE, INTEGRATIONS, NOOP } from '../../utils/constants';
import { MdKeyboardArrowDown, MdKeyboardArrowUp, MdSettings } from 'react-icons/md';
import { IoMdCamera } from 'react-icons/io';
import _ from 'lodash';
import Toggle from 'react-toggle'

import {
  changeFirstname, changeLastname, changeBio, editUser,
  requestSaveUser, requestGetUser, requestUpdateUserPermissions
} from '../../actions/profile';

import Loader from '../../components/common/Loader';
import { isLoggedIn } from '../../utils/auth';

import { getStyleApplicationFn } from '../../utils/style';
import style from './profile.css';
const s = getStyleApplicationFn(style);

import SlackIcon from '../../assets/images/icons/Slack_Mark.svg';
import GoogleDriveIcon from '../../assets/images/icons/GoogleDrive_Icon.svg';
import ZendeskIcon from '../../assets/images/icons/Zendesk_Icon.svg';
import GmailIcon from '../../assets/images/icons/Gmail_Icon.svg';
import JiraIcon from '../../assets/images/icons/Jira_Icon.svg';
import SalesforceIcon from '../../assets/images/icons/Salesforce_Icon.svg';
import HubspotIcon from '../../assets/images/icons/Hubspot_Icon.svg';
import HelpscoutIcon from '../../assets/images/icons/Helpscout_Icon.svg';

const PROFILE_SETTING_SECTION_TYPE = {
  KNOWLEDGE_BASE: 'KNOWLEDGE_BASE',
  COMMUNICATION: 'COMMUNICATION',
  AUTOFIND: 'AUTOFIND',
};

const PROFILE_SETTING_SECTIONS = [
  {
    type: PROFILE_SETTING_SECTION_TYPE.KNOWLEDGE_BASE,
    title: 'Knowledge Base Integrations',
    integrations: [INTEGRATIONS.GOOGLE, INTEGRATIONS.ZENDESK],
  },
  {
    type: PROFILE_SETTING_SECTION_TYPE.COMMUNICATION,
    title: 'Communication Integrations',
    integrations: [INTEGRATIONS.SLACK],
  },
  {
    type: PROFILE_SETTING_SECTION_TYPE.AUTOFIND,
    title: 'Autofind Permissions',
    integrations: [INTEGRATIONS.GMAIL, INTEGRATIONS.ZENDESK, INTEGRATIONS.SALESFORCE, INTEGRATIONS.HUBSPOT, INTEGRATIONS.JIRA, INTEGRATIONS.HELPSCOUT],
  }
];

const PROFILE_NOTIFICATIONS_OPTIONS = {
  EMAIL: 'email',
  SLACK: 'slack',
  CHROME: 'chrome'
}

@connect(
  state => ({
    ...state.profile,
    token: state.auth.token,
  }),
  dispatch =>
    bindActionCreators(
      {
        changeFirstname,
        changeLastname,
        changeBio,
        requestSaveUser,
        editUser,
        requestGetUser,
        requestUpdateUserPermissions,
        logout,
      },
      dispatch
    )
)

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sectionOpen: _.mapValues(PROFILE_SETTING_SECTION_TYPE, () => false),
      notificationsOpen: false,
    };
  }

  componentDidMount() {
    this.props.requestGetUser();
  }

  saveUser = () => {
    const { requestSaveUser } = this.props;
    requestSaveUser();
  }

  renderAboutSection = () => {
    //const {  } = this.state;
    const { user, userEdits, changeFirstname, changeLastname, changeBio, requestSaveUser, isSavingUser, isEditingAbout, editUser } = this.props;
    return (
      <div className={s('flex flex-col')}>
        { isSavingUser ?
          <Loader />
          :
          <div className={s('flex')}>
            <div className={s('mr-reg relative')}>
              <PlaceholderImg name={`${user.firstname} ${user.lastname}`} src={user.img} className={s(`profile-profile-picture rounded-full ${isEditingAbout ? 'opacity-50' : ''}`)} />
              {
                isEditingAbout ?
                  <div className={s('absolute profile-edit-photo-icon bg-purple-light rounded-full profile-edit-container flex cursor-pointer')}>
                    <IoMdCamera className={s('text-purple-reg m-auto')} />
                  </div> :
                  <div
                    className={s('absolute bottom-0 right-0 bg-purple-light rounded-full profile-edit-container flex cursor-pointer')}
                    onClick={() => editUser()}
                  >
                    <MdEdit className={s('text-purple-reg m-auto')} />
                  </div>
              }
            </div>
            <div className={s('flex flex-col min-w-0')}>
              { !isEditingAbout && <div className={s('text-sm text-purple-reg mt-xs')}> {user.companyName} • {user.role}</div> }

              {
                isEditingAbout ?
                  <div>
                    <div className={s('flex')}>
                      <input
                        placeholder="First Name"
                        className={s('profile-about-input flex-grow mr-sm min-w-0 flex-1 cursor-text')}
                        value={userEdits.firstname}
                        onChange={e => changeFirstname(e.target.value)}
                      />
                      <input
                        placeholder="Last Name"
                        className={s('profile-about-input flex-grow ml-sm min-w-0 flex-1 cursor-text')}
                        value={userEdits.lastname}
                        onChange={e => changeLastname(e.target.value)}
                      />
                    </div>
                    <input
                      placeholder="Bio (eg. Support Manager @ Pied Piper)"
                      className={s('profile-about-input w-full min-w-0 flex-1 mt-reg cursor-text')}
                      value={userEdits.bio}
                      onChange={e => changeBio(e.target.value)}
                    />
                  </div>

                :
                  <div>
                    <div className={s('text-reg font-semibold mt-xs')}> {user.firstname} {user.lastname}</div>
                    <div className={s('text-sm text-gray-dark mt-sm')}> {user.bio}</div>
                  </div>
              }
            </div>
          </div>

        }
        {
            isEditingAbout &&
            <Button
              text={'Save Changes'}
              className={s('bg-purple-light text-purple-reg mt-reg')}
              onClick={() => this.saveUser()}
            />
          }
      </div>
    );
  }

  renderMetricsSection = () => (
    <div className={s('bg-white shadow-light p-reg mt-reg rounded-lg')}>
      <div className={s('text-xl text-purple-reg font-semibold')}>99%</div>
      <div className={s('text-sm text-purple-reg mt-sm')}> Cards up to date</div>
    </div>
    )

  getIntegrationInfo = (integration) => {
    switch (integration) {
      case INTEGRATIONS.GOOGLE:
        return { title: 'Google Drive', logo: GoogleDriveIcon };
      case INTEGRATIONS.ZENDESK:
        return { title: 'Zendesk', logo: ZendeskIcon };
      case INTEGRATIONS.SLACK:
        return { title: 'Slack', logo: SlackIcon };      
      case INTEGRATIONS.GMAIL:
        return { title: 'Gmail', logo: GmailIcon };
      case INTEGRATIONS.SALESFORCE:
        return { title: 'Salesforce', logo: SalesforceIcon };
      case INTEGRATIONS.HUBSPOT:
        return { title: 'Hubspot', logo: HubspotIcon };
      case INTEGRATIONS.JIRA:
        return { title: 'Jira', logo: JiraIcon };
      case INTEGRATIONS.ZENDESK:
        return { title: 'Zendesk', logo: ZendeskIcon };
      case INTEGRATIONS.HELPSCOUT:
        return { title: 'Helpscout', logo: HelpscoutIcon };
      default:
        return {};
    }
  }

  renderIntegrations = ({ type, integrations }) => {
    const { user, requestUpdateUserPermissions, changeUserPermissionsError } = this.props;
    const { autofindPermissions } = user;

    const isAutofind = type === PROFILE_SETTING_SECTION_TYPE.AUTOFIND;

    return (
      <div>
        { integrations.map((integration, i) => {
          const { title, logo } = this.getIntegrationInfo(integration);
          const isEnabled = isAutofind ? autofindPermissions[integration] : isLoggedIn(user, integration);
          
          return (
            <div key={title} className={s(`flex bg-white p-reg justify-between border border-solid border-gray-xlight items-center rounded-lg ${i > 0 ? 'mt-sm' : ''}`)}>
              <div className={s('flex items-center')}>
                <div className={s('profile-integration-img-container')}>
                  <img src={logo} className={s('profile-integration-img')} />
                </div>
                <div className={s('text-sm')}> {title} </div>
              </div>
              { isAutofind ?
                <Toggle
                  checked={autofindPermissions[integration]}
                  icons={false}
                  onChange={() => requestUpdateUserPermissions(USER_PERMISSION_TYPE.AUTOFIND, integration)}
                /> :
                <IntegrationAuthButton integration={integration} />
              }
            </div>
          );
        })}
      </div>
    );
  }

  toggleIntegrationSection = (type) => {
    const { sectionOpen } = this.state;
    this.setState({ sectionOpen: { ...sectionOpen, [type]: !sectionOpen[type] } });
  }

  toggleIntegration = (userIntegrations, integration) => {
    return {
      ...userIntegrations,
      [integration]: !userIntegrations[integration]
    };
  }

  renderIntegrationsSection = () => {
    const { user, permissionState } = this.props;
    const { sectionOpen } = this.state;

    return (
      <div className={s('flex flex-col overflow-auto flex-grow px-lg py-sm')}>
        { PROFILE_SETTING_SECTIONS.map((profileSettingSection, i) => {
          const { type, title } = profileSettingSection;
          const isOpen = sectionOpen[type];
          const Icon = isOpen ? MdKeyboardArrowUp : MdKeyboardArrowDown;

          const { error, isLoading } = permissionState[USER_PERMISSION_TYPE.AUTOFIND];
          const isAutofind = type === PROFILE_SETTING_SECTION_TYPE.AUTOFIND;

          return (
            <div
              key={title}
              className={s(`profile-integration-container ${isOpen ? 'profile-integration-container-active' : 'profile-integration-container-inactive'} ${i !== 0 ? 'mt-reg' : ''}`)}
            >
              <div
                className={s(`py-sm flex items-center justify-between ${isOpen ? 'mb-sm' : ''}`)}
                onClick={() => this.toggleIntegrationSection(type)}
              >
                <div className={s('text-purple-reg text-sm')}>{title}</div>
                <div className={s('flex items-center')}>
                  { isAutofind && isLoading && 
                    <Loader size={10} className={s('mr-sm')} />
                  }
                  <Icon className={s('text-gray-dark cursor-pointer')} />
                </div>
              </div>
              <AnimateHeight height={isOpen ? 'auto' : 0} animationStateClasses={{ animatingUp: s('invisible') }}>
                {this.renderIntegrations(profileSettingSection)}
              </AnimateHeight>
              { isAutofind && error && 
                <div className={s('error-text my-sm')}> {error} </div>
              }
            </div>
          );
        })}
      </div>
    );
  }

  renderSettingsSection = () => {
    const { user, permissionState, requestUpdateUserPermissions, changeUserPermissionsError } = this.props;
    const { notificationPermissions } = user;

    const { notificationsOpen } = this.state;
    const { error, isLoading } = permissionState[USER_PERMISSION_TYPE.NOTIFICATION];

    return (
      <AnimateHeight height={notificationsOpen ? 'auto' : 0}>
        <div className={s('profile-settings-container')}>
          <div
            className={s('flex justify-between items-center py-reg px-lg bg-purple-light mb-sm rounded-t-lg cursor-pointer')}
            onClick={() => this.setState({ notificationsOpen: false })}
          > 
            <div className={s('text-xs')}> Receive notifications through: </div>
            <div className={s('flex items-center')}>
              { isLoading && <Loader size={10} className={s('mr-sm')} /> }
              <MdKeyboardArrowDown />
            </div>
          </div>
          <div className={s('px-lg')}>
            {
              Object.values(PROFILE_NOTIFICATIONS_OPTIONS).map((notificationsOption, i) => {
                return (
                  <div className={s('flex justify-between items-center mb-xs')}>
                    <div className={s('text-sm font-semibold')}> {_.capitalize(notificationsOption)} </div>
                    <Toggle
                      checked={notificationPermissions[notificationsOption]}
                      icons={false}
                      onChange={() => requestUpdateUserPermissions(USER_PERMISSION_TYPE.NOTIFICATION, notificationsOption)}
                    />
                  </div>
                )
              })
            }
            { error && 
              <div className={s('error-text my-sm')}> {error} </div>
            }
          </div>
          <div className={s('horizontal-separator')} />
        </div>
      </AnimateHeight>
    )
  }

  render() {
    const { logout, user } = this.props;
    const { sectionOpen, notificationsOpen } = this.state;
    return (
      <div className={s('flex flex-col py-lg min-h-0 flex-grow')}>
        <div className={s('flex flex-col px-lg')}>
          { this.renderAboutSection() }
          { this.renderMetricsSection() }
          <div className={s('horizontal-separator my-reg')} />
        </div>
        { this.renderIntegrationsSection() }
        { this.renderSettingsSection() }
        <div className={s('flex justify-between pt-reg px-lg')}>
          <div className={s('text-sm text-gray-dark')}> {user.email} </div>
          <div className={s('flex')}>
            <MdSettings
              className={s('mr-sm text-purple-reg cursor-pointer pr-sm profile-settings-icon')} 
              onClick={ () => this.setState({ notificationsOpen: !notificationsOpen }) } />
            <div className={s('text-sm text-purple-reg underline cursor-pointer')} onClick={() => logout()}> Logout </div>
          </div>
        </div>
      </div>
    );
  }
}

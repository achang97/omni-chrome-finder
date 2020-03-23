import React, { Component, PropTypes } from 'react';
import AnimateHeight from 'react-animate-height';
import Button from '../../components/common/Button';
import CheckBox from '../../components/common/CheckBox';
import PlaceholderImg from '../../components/common/PlaceholderImg';
import Dropdown from '../../components/common/Dropdown';
import ProfileIntegration from '../../components/profile/ProfileIntegration';

import { logout } from '../../actions/auth';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { MdEdit } from 'react-icons/md';
import { INTEGRATIONS, NOOP, 
         SLACK_AUTH_URL } from '../../utils/constants';
import { MdKeyboardArrowDown, MdKeyboardArrowUp, MdSettings } from 'react-icons/md';
import { IoMdCamera } from 'react-icons/io';
import _ from 'lodash';
import Toggle from 'react-toggle'

import { changeFirstname, changeLastname, changeBio, requestSaveUser, editUser, requestGetUser, requestChangeUserPermissions } from '../../actions/profile';

import Loader from '../../components/common/Loader';
import { SERVER_URL } from '../../utils/request';
import { isLoggedIn } from '../../utils/auth';

import "react-toggle/style.css";
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


const GOOGLE_AUTH_URL = `${SERVER_URL}/google/authenticate`;
const ZENDESK_AUTH_URL = `${SERVER_URL}/zendesk/authenticate`;

const MOCK_USER = {
  autofindPermissions: {
    zendesk: true,
    helpscout: false,
  }
};

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
    permissions: [INTEGRATIONS.GMAIL, INTEGRATIONS.ZENDESK, INTEGRATIONS.SALESFORCE, INTEGRATIONS.HUBSPOT, INTEGRATIONS.JIRA, INTEGRATIONS.HELPSCOUT],
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
        requestChangeUserPermissions,
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
      notificationToggle: false,
      notificationsOpen: false,
    };
  }

  componentDidMount() {
    this.props.requestGetUser();
  }

  openGoogleLogin() {
    //TODO: Refactor this in more beauty way.
    //CLOSE popup on finish.
    const clearToken = this.props.token.replace('Bearer ', '');
    window.open(`${GOOGLE_AUTH_URL}?auth=${clearToken}`, 'popup', 'width=600,height=600');
  }

  openZendeskLogin() {
    //TODO: Refactor this in more beauty way.
    //CLOSE popup on finish.
    const clearToken = this.props.token.replace('Bearer ', '');
    window.open(`${ZENDESK_AUTH_URL}?auth=${clearToken}`, 'popup', 'width=600,height=600');
  }

  openSlackLogin() {
    const { user } = this.props;
    window.open(`${SLACK_AUTH_URL}${user._id}`, '_blank');
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
        return { title: 'Google Drive', logo: GoogleDriveIcon, onSignIn: () => this.openGoogleLogin(), onSignOut: () => {} };
      case INTEGRATIONS.ZENDESK:
        return { title: 'Zendesk', logo: ZendeskIcon, onSignIn: () => this.openZendeskLogin(), onSignOut: () => {} };
      case INTEGRATIONS.SLACK:
        return { title: 'Slack', logo: SlackIcon, onSignIn: () => this.openSlackLogin(), onSignOut: () => {} };
      default:
        return {};
    }
  }
//[INTEGRATIONS.GMAIL, INTEGRATIONS.ZENDESK, INTEGRATIONS.SALESFORCE, INTEGRATIONS.HUBSPOT, INTEGRATIONS.JIRA, INTEGRATIONS.HELPSCOUT],
  getPermissionInfo = (permission) => {
    switch (permission) {
      case INTEGRATIONS.GMAIL:
        return { title: 'Gmail', logo: GmailIcon, onEnable: () => { return; }, onDisable: () => { return; } };
      case INTEGRATIONS.SALESFORCE:
        return { title: 'Salesforce', logo: SalesforceIcon, onEnable: () => { return; }, onDisable: () => { return; } };
      case INTEGRATIONS.HUBSPOT:
        return { title: 'Hubspot', logo: HubspotIcon, onEnable: () => { return; }, onDisable: () => { return; } };
      case INTEGRATIONS.JIRA:
        return { title: 'Jira', logo: JiraIcon, onEnable: () => { return; }, onDisable: () => { return; } };
      case INTEGRATIONS.ZENDESK:
        return { title: 'Zendesk', logo: ZendeskIcon, onEnable: () => { return; }, onDisable: () => { return; } };
      case INTEGRATIONS.HELPSCOUT:
        return { title: 'Helpscout', logo: HelpscoutIcon, onEnable: () => { return; }, onDisable: () => { return; } };
      default:
        return {};
    }
  }

  renderAutofindPermissions = (profileSettingSection) => {
    const { user, requestChangeUserPermissions, changeUserPermissionsError } = this.props;
    const { autofindPermissions } = user;

    const isEnabled = true;
    return (
      <div>
        {
          profileSettingSection.permissions.map((permission, i) => {
            const { title, logo } = this.getPermissionInfo(permission);
            const isEnabled = MOCK_USER.autofindPermissions[permission];
            return (
              <div key={title} className={s(`flex bg-white p-reg justify-between border border-solid border-gray-xlight items-center rounded-lg ${i > 0 ? 'mt-sm' : ''}`)}>
                <div className={s('flex items-center')}>
                  <div className={s('profile-integration-img-container flex rounded-full border border-solid border-gray-light mr-reg')}>
                    <img src={logo} className={s('m-auto profile-integration-img')} />
                  </div>
                  <div className={s('text-sm ')}> {title} </div>
                </div>
                <Toggle
                  checked={autofindPermissions[permission]}
                  icons={false}
                  onChange={ () => requestChangeUserPermissions( { autofindPermissions: { ...autofindPermissions, [permission] : !autofindPermissions[permission] } } ) }  />
              </div>
            );
          })
        }
      </div>
    );
  }

  renderIntegrations = (profileSettingSection) => {
    const { user } = this.props;
    return (
      <div>
        {
          profileSettingSection.integrations.map((integration, i) => {
            const isSignedIn = isLoggedIn(user, integration);
            const { title, logo, onSignIn, onSignOut } = this.getIntegrationInfo(integration);
            return (
              <ProfileIntegration
                index={i}
                title={title}
                logo={logo}
                isSignedIn={isSignedIn}
                onSignIn={onSignIn}
                onSignOut={onSignOut}
              />
            );
          })
        }
      </div>
    );
  }

  toggleIntegration = (type) => {
    const { sectionOpen } = this.state;
    this.setState({ sectionOpen: { ...sectionOpen, [type]: !sectionOpen[type] } });
  }

  renderIntegrationsSection = () => {
    const { user } = this.props;
    const { sectionOpen } = this.state;
    return (
      <div className={s('flex flex-col overflow-auto flex-grow')}>
        { PROFILE_SETTING_SECTIONS.map((profileSettingSection, i) => {
          const { type, title } = profileSettingSection;
          const isOpen = sectionOpen[type];
          const Icon = isOpen ? MdKeyboardArrowUp : MdKeyboardArrowDown;

          return (
            <div
              key={title}
              className={s(`profile-integration ${isOpen ? 'profile-integration-active' : 'profile-integration-inactive'} ${i !== 0 ? 'mt-reg' : ''}`)}
            >
              <div
                className={s(`py-sm flex items-center justify-between ${isOpen ? 'mb-sm' : ''}`)}
                onClick={() => this.toggleIntegration(type)}
              >
                <div className={s('text-purple-reg text-sm')}>{title}</div>
                <Icon className={s('text-gray-dark cursor-pointer')} />
              </div>
              <AnimateHeight height={isOpen ? 'auto' : 0} animationStateClasses={{ animatingUp: s('invisible') }}>
                { (type === PROFILE_SETTING_SECTION_TYPE.AUTOFIND ?
                  this.renderAutofindPermissions(profileSettingSection) :
                  this.renderIntegrations(profileSettingSection)
                )}
              </AnimateHeight>
            </div>
          );
        })}
      </div>
    );
  }

  renderSettingsSection = () => {
    const { user, requestChangeUserPermissions, changeUserPermissionsError } = this.props;
    const { notificationPermissions } = user;

    const { notificationToggle, notificationsOpen } = this.state;

    return (
      <div className={s('flex flex-col')}>
        <div className={s('flex justify-between my-sm')}> 
          <div> Receive notifications through: </div>
          <MdKeyboardArrowDown 
            className={s('cursor-pointer')}
            onClick={() => this.setState({ notificationsOpen: false })}
          />
        </div>
        { changeUserPermissionsError && 
          <div className={s('text-red-reg mb-sm')}> {changeUserPermissionsError} </div>
        }
        {
          Object.values(PROFILE_NOTIFICATIONS_OPTIONS).map((notificationsOption, i) => {
            return (
              <div className={s('flex justify-between items-center mb-xs')}>
                <div className={s('text-sm font-semibold')}> { notificationsOption } </div>
                <Toggle
                  checked={notificationPermissions[notificationsOption]}
                  icons={false}
                  onChange={ () => requestChangeUserPermissions( { notificationPermissions: { ...notificationPermissions, [notificationsOption] : !notificationPermissions[notificationsOption] } }) }  />
              </div>
            )
          })
        }
      </div>
    )
  }

  render() {
    const { logout, user } = this.props;
    const { sectionOpen, notificationsOpen } = this.state;
    return (
      <div className={s('flex flex-col p-lg min-h-0 flex-grow')}>
        { this.renderAboutSection() }
        { this.renderMetricsSection() }
        <div className={s('horizontal-separator my-reg')} />
        { this.renderIntegrationsSection() }
        { notificationsOpen && this.renderSettingsSection() }
        <div className={s('flex justify-between pt-reg')}>
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

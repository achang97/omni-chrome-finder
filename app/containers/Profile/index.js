import React, { Component, PropTypes } from 'react';
import AnimateHeight from 'react-animate-height';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';

import Button from '../../components/common/Button';
import CheckBox from '../../components/common/CheckBox';
import PlaceholderImg from '../../components/common/PlaceholderImg';
import Dropdown from '../../components/common/Dropdown';
import IntegrationAuthButton from '../../components/profile/IntegrationAuthButton';

import { logout } from '../../actions/auth';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { MdEdit } from 'react-icons/md';
import { PROFILE_SETTING_SECTION_TYPE, INTEGRATIONS, NOOP } from '../../utils/constants';
import { MdKeyboardArrowDown, MdKeyboardArrowUp, MdSettings } from 'react-icons/md';
import { IoMdCamera } from 'react-icons/io';
import _ from 'lodash';
import Toggle from 'react-toggle';

import {
  changeFirstname, changeLastname, changeBio, editUser,
  requestSaveUser, requestGetUser, requestUpdateUserPermissions
} from '../../actions/profile';

import Loader from '../../components/common/Loader';
import { isLoggedIn } from '../../utils/auth';

import { colors } from '../../styles/colors';
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
import GoogleChromeIcon from '../../assets/images/icons/GoogleChrome_Icon.svg';

const PROFILE_NOTIFICATIONS_OPTIONS = [
  { type: 'email', title: 'Email', logo: GmailIcon },
  INTEGRATIONS.SLACK,
  { type: 'chrome', title: 'Chrome', logo: GoogleChromeIcon },
];

const PROFILE_SETTING_SECTIONS = [
  {
    type: PROFILE_SETTING_SECTION_TYPE.KNOWLEDGE_BASE,
    title: 'Knowledge Base Integrations',
    options: [INTEGRATIONS.GOOGLE, INTEGRATIONS.ZENDESK],
    toggle: false,
  },
  {
    type: PROFILE_SETTING_SECTION_TYPE.COMMUNICATION,
    title: 'Communication Integrations',
    options: [INTEGRATIONS.GMAIL, INTEGRATIONS.SLACK],
    toggle: false,
  },
  {
    type: PROFILE_SETTING_SECTION_TYPE.AUTOFIND,
    title: 'Autofind Permissions',
    options: [
      INTEGRATIONS.GMAIL,
      { ...INTEGRATIONS.ZENDESK, disabled: true },
      { ...INTEGRATIONS.SALESFORCE, disabled: true },
      { ...INTEGRATIONS.HUBSPOT, disabled: true },
      { ...INTEGRATIONS.JIRA, disabled: true },
      { ...INTEGRATIONS.HELPSCOUT, disabled: true },
    ],
    toggle: true,
  },
  {
    type: PROFILE_SETTING_SECTION_TYPE.NOTIFICATIONS,
    title: 'Notification Permissions',
    options: PROFILE_NOTIFICATIONS_OPTIONS,
    toggle: true,
  }
];

const PROGRESS_BAR_STYLES = {
  // How long animation takes to go from one percentage to another, in seconds
  pathTransitionDuration: 0.5,

  // Colors
  textColor: colors.purple.reg,
  pathColor: colors.purple.reg,
};

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sectionOpen: _.mapValues(PROFILE_SETTING_SECTION_TYPE, () => false),
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

  renderMetricsSection = () => {
    const { count=0, totalUpvotes, upToDateCount, outOfDateCount } = this.props.analytics;

    let upToDatePercentage = 0;
    let upToDatePercentageText = '--';

    if (count !== 0) {
      upToDatePercentage = Math.floor((upToDateCount / count) * 100);
      upToDatePercentageText = `${upToDatePercentage}%`;
    }

    return (
      <div className={s('flex justify-between bg-white shadow-light p-reg mt-reg rounded-lg')}>
        <div>
          <div className={s('text-xl text-purple-reg font-semibold')}>
            {upToDatePercentageText}
          </div>
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
  }

  renderIntegrations = ({ type, toggle, options }) => {
    const { user, requestUpdateUserPermissions, changeUserPermissionsError } = this.props;
    const { autofindPermissions, notificationPermissions } = user;
    
    return (
      <div>
        { options.map(({ type: optionType, title, logo, disabled }, i) => {
          return (
            <div key={title} className={s(`flex bg-white p-reg justify-between border border-solid border-gray-xlight items-center rounded-lg ${i > 0 ? 'mt-sm' : ''}`)}>
              <div className={s('flex flex-1 items-center')}>
                <div className={s('profile-integration-img-container')}>
                  <img src={logo} className={s('profile-integration-img')} />
                </div>
                <div className={s('flex-1 text-sm')}> {title} </div>
              </div>
              { disabled &&
                <span className={s('text-xs italic text-gray-light mx-sm')}>
                  Coming soon!
                </span>
              }
              { toggle ?
                <Toggle
                  checked={!disabled && (type === PROFILE_SETTING_SECTION_TYPE.AUTOFIND ?
                    autofindPermissions[optionType] :
                    notificationPermissions[optionType]
                  )}
                  disabled={disabled}
                  icons={false}
                  onChange={() => requestUpdateUserPermissions(type, optionType)}
                /> :
                <IntegrationAuthButton integration={optionType} />
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

  renderIntegrationsSection = () => {
    const { user, permissionState } = this.props;
    const { sectionOpen } = this.state;

    return (
      <div className={s('flex flex-col overflow-auto flex-grow px-lg py-sm')}>
        { PROFILE_SETTING_SECTIONS.map((profileSettingSection, i) => {
          const { type, title, toggle } = profileSettingSection;
          const isOpen = sectionOpen[type];
          const Icon = isOpen ? MdKeyboardArrowUp : MdKeyboardArrowDown;

          let error, isLoading;
          if (toggle) {
            error = permissionState[type].error;
            isLoading = permissionState[type].isLoading;
          }

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
                  { toggle && isLoading &&
                    <Loader size="xs" className={s('mr-sm')} />
                  }
                  <Icon className={s('text-gray-dark cursor-pointer')} />
                </div>
              </div>
              <AnimateHeight height={isOpen ? 'auto' : 0} animationStateClasses={{ animatingUp: s('invisible') }}>
                {this.renderIntegrations(profileSettingSection)}
              </AnimateHeight>
              { toggle && error &&
                <div className={s('error-text my-sm')}> {error} </div>
              }
            </div>
          );
        })}
      </div>
    );
  }

  render() {
    const { logout, user } = this.props;
    const { sectionOpen } = this.state;
    return (
      <div className={s('flex flex-col py-lg min-h-0 flex-grow')}>
        <div className={s('flex flex-col px-lg')}>
          { this.renderAboutSection() }
          { this.renderMetricsSection() }
          <div className={s('horizontal-separator my-reg')} />
        </div>
        { this.renderIntegrationsSection() }
        <div className={s('flex justify-between pt-reg px-lg')}>
          <div className={s('text-sm text-gray-dark')}> {user.email} </div>
          <div className={s('text-sm text-purple-reg underline cursor-pointer')} onClick={() => logout()}> Logout </div>
        </div>
      </div>
    );
  }
}

export default connect(
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
)(Profile);

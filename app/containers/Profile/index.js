import React, { Component, PropTypes } from 'react';
import Button from '../../components/common/Button';
import CheckBox from '../../components/common/CheckBox';
import PlaceholderImg from '../../components/common/PlaceholderImg';

import { logout } from '../../actions/auth';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { getStorageName } from '../../utils/constants';
import { MdEdit } from 'react-icons/md'
import { PROFILE_SETTING_SECTIONS, INTEGRATIONS, AUTOFIND_PERMISSIONS } from '../../utils/constants';
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md'
import { IoMdCamera } from "react-icons/io";

import { changeFirstname, changeLastname, changeBio, requestSaveUser, editUser, requestGetUser } from '../../actions/profile';

import Loader from '../../components/common/Loader';
import { SERVER_URL } from '../../utils/request';

import { getStyleApplicationFn } from '../../utils/styleHelpers';
import style from './profile.css';
const s = getStyleApplicationFn(style);

import { default as SlackIcon } from "../../assets/images/icons/Slack_Mark.svg";
import { default as GoogleDriveIcon } from "../../assets/images/icons/GoogleDrive_Icon.svg";

const GOOGLE_AUTH_URL = `${SERVER_URL}/google/authenticate`;

const MOCK_USER = {
  autofindPermissions: {
    zendesk: true,
    helpscout: false,
  }
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
        logout,
      },
      dispatch
    )
)

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sectionOpen: {
        [ PROFILE_SETTING_SECTIONS.KNOWLEDGE_BASE_INTEGRATIONS.title ] : false,
        [ PROFILE_SETTING_SECTIONS.COMMUNICATION_INTEGRATIONS.title ]: false,
      },
      isEditingAbout: false,
    }
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

  saveUser = () => {
    const { requestSaveUser } = this.props;
    requestSaveUser();
    this.setState({ isEditingAbout: false })
  }

  renderAboutSection = () => {
    //const {  } = this.state;
    const { user, userEdits, changeFirstname, changeLastname, changeBio, requestSaveUser, isSavingUser, isEditingAbout, editUser } = this.props;
    return(
      <div className={s('flex flex-col')}>
        { isSavingUser ?
          <Loader className={s("")}/>
          :
          <div className={s('flex')}>
            <div className={s('mr-reg relative')}>
              <PlaceholderImg name={user.firstname + ' ' + user.lastname} src={user.img}  className={s(`profile-profile-picture rounded-full ${isEditingAbout ? 'opacity-50' : ''}`)}/>
              {
                isEditingAbout ?
                <div className={s('absolute profile-edit-photo-icon bg-purple-light rounded-full profile-edit-container flex cursor-pointer')}>
                    <IoMdCamera className={s('text-purple-reg m-auto')} />
                </div> :
                <div className={s('absolute bottom-0 right-0 bg-purple-light rounded-full profile-edit-container flex cursor-pointer')}
                     onClick={() => editUser() } >
                    <MdEdit className={s('text-purple-reg m-auto')} />
                </div>
              }
            </div>
            <div className={s('flex flex-col min-w-0')}>
              { !isEditingAbout && <div className={s('text-sm text-purple-reg mt-xs')}> {user.companyName} • {user.role}</div> }

              {
                isEditingAbout ? 
                  <div>
                    <div className={s("flex")}>
                      <input
                        placeholder="First Name"
                        className={s("profile-about-input flex-grow mr-sm min-w-0 flex-1 cursor-text")}
                        value={userEdits.firstname}
                        onChange={ (e) => changeFirstname(e.target.value) }
                      />
                      <input
                        placeholder="Last Name"
                        className={s("profile-about-input flex-grow ml-sm min-w-0 flex-1 cursor-text")}
                        value={userEdits.lastname}
                        onChange={ (e) => changeLastname(e.target.value) }
                      />  
                    </div>
                    <input
                      placeholder="Bio (eg. Support Manager @ Pied Piper)"
                      className={s("profile-about-input w-full min-w-0 flex-1 mt-reg cursor-text")}
                      value={userEdits.bio}
                        onChange={ (e) => changeBio(e.target.value) }
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
              text={"Save Changes"}
              className={s('bg-purple-light text-purple-reg mt-reg')}
              onClick={ () => this.saveUser() }
              />
          }
      </div>
    )
  }

  renderMetricsSection = () => {
    return (
      <div className={s("bg-white shadow-light p-reg mt-reg rounded-lg")}>
        <div className={s("text-xl text-purple-reg font-semibold")}>99%</div>
        <div className={s("text-sm text-purple-reg mt-sm")}> Cards up to date</div>
      </div>
    )
  }

  getIntegrationInfo = (integration) => {
    switch (integration) {
      case INTEGRATIONS.GOOGLE:
        return { title: "Google Drive", logo: GoogleDriveIcon, onSignIn: () => this.openGoogleLogin(), onSignOut: () => { return } }
      case INTEGRATIONS.SLACK:
        return { title: "Slack", logo: SlackIcon, onSignIn: () => { return }, onSignOut: () => { return } }
      default:
        return {}; 
    }
  }

  getPermissionInfo = (permission) => {
    switch (permission) {
      case AUTOFIND_PERMISSIONS.ZENDESK:
        return { title: "Zendesk", logo: GoogleDriveIcon, onEnable: () => { return }, onDisable: () => { return } }
      case AUTOFIND_PERMISSIONS.HELPSCOUT:
        return { title: "Helpscout", logo: SlackIcon, onEnable: () => { return }, onDisable: () => { return } }
      default:
        return {}; 
    }
  }

  renderAutofindPermissions = (profileSettingSection) => {
    const isEnabled = true;
    return (
      <div> 
        {
          profileSettingSection.permissions.map((permission, i) => {
            const { title, logo } = this.getPermissionInfo(permission);
            const isEnabled = MOCK_USER.autofindPermissions[permission];
            return(
              <div className={s(`flex bg-white p-reg justify-between border border-solid border-gray-xlight items-center rounded-lg ${ i > 0 ? 'mt-sm' : '' }`)}>
                <div className={s("flex items-center")}>
                  <div className={s("profile-integration-img-container flex rounded-full border border-solid border-gray-light mr-reg")}> 
                    <img src={logo} className={s('m-auto profile-integration-img')} />
                  </div>
                  <div className={s("text-sm ")}> {title} </div>
                </div>
                <CheckBox 
                  isSelected={isEnabled} 
                  toggleCheckbox={() => { return }}
                  className={s("flex-shrink-0 margin-xs")}
                  unselectedClassName={s("bg-white")}
                  selectedClassName={s("bg-purple-reg text-white")}
                />
              </div>
            )
          })
        }
      </div>
    )
  }

  renderIntegrations = (profileSettingSection) => {
    const { user } = this.props;
    return(
      <div> 
        {
          profileSettingSection.integrations.map((integration, i ) => {
            const isSignedIn = user.integrations[integration].access_token !== undefined;
            const { title, logo, onSignIn, onSignOut } = this.getIntegrationInfo(integration);
            return (
              <div className={s(`flex bg-white p-reg justify-between border border-solid border-gray-xlight items-center rounded-lg ${ i > 0 ? 'mt-sm' : '' }`)}>
                <div className={s("flex items-center")}>
                  <div className={s("profile-integration-img-container flex rounded-full border border-solid border-gray-light mr-reg")}> 
                    <img src={logo} className={s('m-auto profile-integration-img')} />
                  </div>
                  <div className={s("text-sm ")}> {title} </div>
                </div>
                {
                  isSignedIn ?
                  <Button
                    text="Connected"
                    color="secondary"
                    className={s("text-green-reg bg-green-xlight p-reg")}
                    icon={<MdKeyboardArrowDown className={s("ml-reg")} />}
                    iconLeft={false}
                    />
                  :
                  <Button
                    text="Sign In"
                    color="transparent"
                    className={s("p-reg")}
                    onClick={() => onSignIn()}
                    />
                }
              </div>
            )
          })
        }
      </div>
    )
  }

  renderIntegrationsSection = () => {
    const { user } = this.props;
    const { sectionOpen } = this.state;
    return(
      <div className={s('flex flex-col overflow-auto flex-grow')}>
      {
        Object.values(PROFILE_SETTING_SECTIONS).map((profileSettingSection, j) => {
          if(sectionOpen[profileSettingSection.title]) {
            return (
              <div className={s(`flex flex-col bg-purple-light px-reg pt-xl pb-reg rounded-lg ${ j > 0 ? 'mt-reg' : '' }`)}>
                <div className={s("flex items-center mb-reg justify-between")}>
                  <div className={s("text-purple-reg text-sm")}>{profileSettingSection.title}</div>
                  <MdKeyboardArrowUp className={s("text-gray-dark cursor-pointer")}
                  onClick={() => this.setState({ sectionOpen: { ...sectionOpen, [ profileSettingSection.title ] : false } })}/>
                </div>
                {
                  profileSettingSection.title === PROFILE_SETTING_SECTIONS.AUTOFIND_PERMISSIONS.title ?
                  this.renderAutofindPermissions(profileSettingSection)
                  :
                  this.renderIntegrations(profileSettingSection)
                }
              </div>
            )
          } else {
            return (
              <div className={s(`flex items-center border border-solid border-gray-light rounded-lg py-xl px-reg justify-between bg-white cursor-pointer ${ j > 0 ? 'mt-reg' : '' }`)}
                   onClick={() => this.setState({ sectionOpen: { ...sectionOpen, [ profileSettingSection.title ] : true } })}>
                <div className={s("text-purple-reg text-sm")}>{ profileSettingSection.title }</div>
                <MdKeyboardArrowDown className={s("text-gray-dark")}/>
              </div>
            )
          }
        })
      } 
      </div>
    )
  }

  render() {
    const { logout, user } = this.props;
    const { sectionOpen } = this.state;
    return (
      <div className={s('flex flex-col p-lg min-h-0 flex-grow')}>
        { this.renderAboutSection() }
        { this.renderMetricsSection() }
        <div className={s("horizontal-separator my-reg")} ></div>
        { this.renderIntegrationsSection() }
        <div className={s('flex justify-between')}>
          <div className={s('text-sm text-gray-dark')}> {user.email} </div>
          <div className={s('text-sm text-purple-reg underline cursor-pointer')} onClick={() => logout()}> Logout </div>
        </div>
      </div>
    );
  }
}

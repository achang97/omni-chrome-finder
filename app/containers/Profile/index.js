import React, { Component, PropTypes } from 'react';
import Button from '../../components/common/Button';

import { logout } from '../../actions/auth';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { getStorageName } from '../../utils/constants';
import { MdEdit } from 'react-icons/md'
import { PROFILE_SETTING_SECTIONS } from '../../utils/constants';
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md'
import { IoMdCamera } from "react-icons/io";

import { changeFirstname, changeLastname, changeBio, requestSaveUser, editUser } from '../../actions/auth';

import Loader from '../../components/common/Loader';
import { getStyleApplicationFn } from '../../utils/styleHelpers';
import style from './profile.css';
const s = getStyleApplicationFn(style);

import { default as SlackIcon } from "../../assets/images/icons/Slack_Mark.svg";
import { default as GmailIcon } from "../../assets/images/icons/Gmail_Icon.svg";

const PROFILE_PICTURE_URL = 'https://janecanblogdotcom.files.wordpress.com/2014/09/ashley-square-profile.jpg';


const SERVER_URL = 'http://localhost:5000/v1';
const GOOGLE_AUTH_URL = `${SERVER_URL}/google/authenticate`;

const MOCK_USER = {
  team: "Omni Support",
  role: "Admin",
  name: "Chetan Rane",
  bio: "COO @ Omni",
  integrations: {
    SLACK: {
      isSignedIn: true,
    },
    GOOGLE: {
      isSignedIn: false,
    }
  }
}

const MOCK_INTEGRATIONS = {
  SLACK: {
    logo: SlackIcon,
    title: "Slack",
    onSignIn: () => { return },
    onSignOut: () => { return } ,
  },
  GOOGLE: {
    logo: GmailIcon,
    title: "Google",
    onSignIn: () => { return } ,
    onSignOut: () => { return } ,
  },
}

@connect(
  state => ({
    ...state.auth
  }),
  dispatch =>
    bindActionCreators(
      {
      	changeFirstname,
        changeLastname,
        changeBio,
        requestSaveUser,
        editUser
      },
      dispatch
    )
)

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sectionOpen: {
        [ PROFILE_SETTING_SECTIONS.AUTOFIND_PERMISSIONS ] : false,
        [ PROFILE_SETTING_SECTIONS.COMMUNICATION_INTEGRATIONS ]: false,
      },
      isEditingAbout: false,
    }
  }

  openGoogleLogin() {
    //TODO: Refactor this in more beauty way.
    //CLOSE popup on finish.
    chrome.storage.sync.get([getStorageName('auth')], (result) => {
      const authStr = result[getStorageName('auth')];
      const authObj = JSON.parse(authStr);
      const clearToken = authObj.token.replace('Bearer ', '');
      window.open(`${GOOGLE_AUTH_URL}?auth=${clearToken}`, 'popup', 'width=600,height=600');
    });
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
              <img src={PROFILE_PICTURE_URL} className={s(`profile-profile-picture rounded-full ${isEditingAbout ? 'opacity-50' : ''}`)} />
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

  renderIntegrationsSection = () => {
    const { sectionOpen } = this.state;
    if (sectionOpen[PROFILE_SETTING_SECTIONS.AUTOFIND_PERMISSIONS]) {
      return (
        <div className={s("flex flex-col bg-purple-light px-reg pt-xl pb-reg rounded-lg")}>
          <div className={s("flex items-center mb-reg justify-between")}>
            <div className={s("text-purple-reg text-sm")}>{PROFILE_SETTING_SECTIONS.AUTOFIND_PERMISSIONS}</div>
            <MdKeyboardArrowUp className={s("text-gray-dark cursor-pointer")}
            onClick={() => this.setState({ sectionOpen: { ...sectionOpen, [ PROFILE_SETTING_SECTIONS.AUTOFIND_PERMISSIONS ] : false } })}/>
          </div>
          {
            Object.keys(MOCK_USER.integrations).map((integration, i) => {
              const { isSignedIn } = MOCK_USER.integrations[integration];
              const { title, logo, onSignIn, onSignOut } = MOCK_INTEGRATIONS[integration];
              return (
                <div className={s(`flex bg-white p-reg justify-between border border-solid border-gray-xlight items-center rounded-lg ${ i > 0 ? 'mt-sm' : '' }`)}>
                  <div className={s("flex items-center")}>
                    <div className={s("profile-integration-img-container flex rounded-full border border-solid border-gray-light mr-reg")}> 
                      <img src={logo} className={s('m-auto')} />
                    </div>
                    <div className={s("text-sm ")}> {title} </div>
                  </div>
                  {
                    isSignedIn ?
                    <Button
                      text="Sign In"
                      color="transparent"
                      className={s("p-reg")}
                      />
                    :
                    <Button
                      text="Connected"
                      color="secondary"
                      className={s("text-green-reg bg-green-xlight p-reg")}
                      icon={<MdKeyboardArrowDown className={s("ml-reg")} />}
                      iconLeft={false}
                      />
                  }
                </div>
              )
            })
          }
        </div>
      ) 
    } 
    else {
      return (
        <div className={s("flex items-center border border-solid border-gray-light rounded-lg py-xl px-reg justify-between bg-white cursor-pointer")}
             onClick={() => this.setState({ sectionOpen: { ...sectionOpen, [ PROFILE_SETTING_SECTIONS.AUTOFIND_PERMISSIONS ] : true } })}>
          <div className={s("text-purple-reg text-sm")}>{PROFILE_SETTING_SECTIONS.AUTOFIND_PERMISSIONS}</div>
          <MdKeyboardArrowDown className={s("text-gray-dark")}/>
        </div>
      )
    }
  }

  render() {
    const { logout, user } = this.props;
    const { sectionOpen } = this.state;
    return (
      <div className={s('flex flex-col p-lg')}>
        { this.renderAboutSection() }
        { this.renderMetricsSection() }
        <div className={s("horizontal-separator my-reg")} ></div>
        { this.renderIntegrationsSection() }
        <a
          target="popup"
          onClick={this.openGoogleLogin}
        >CONNECT GOOGLE</a>
        <Button
          color="primary"
          onClick={logout}
          text="Logout"
        />
      </div>
    );
  }
}

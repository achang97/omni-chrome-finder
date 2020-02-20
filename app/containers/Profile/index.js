import React, { Component, PropTypes } from 'react';
import Button from '../../components/common/Button';

import { logout } from '../../actions/auth';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { getStorageName } from '../../utils/constants';


import { getStyleApplicationFn } from '../../utils/styleHelpers';

const s = getStyleApplicationFn();


const SERVER_URL = 'http://localhost:5000/v1';
const GOOGLE_AUTH_URL = `${SERVER_URL}/google/authenticate`;

@connect(
  state => ({
  }),
  dispatch =>
    bindActionCreators(
      {
      	logout
      },
      dispatch
    )
)

export default class Profile extends Component {

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

  render() {
    const { logout } = this.props;

    return (
      <div className={s('p-lg')}>
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

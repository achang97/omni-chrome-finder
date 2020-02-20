import React, { Component, PropTypes } from 'react';
import Button from '../../components/common/Button';

import { logout } from '../../actions/auth';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { getStyleApplicationFn } from '../../utils/styleHelpers';

const s = getStyleApplicationFn();

// ONLY FOR DEVELOPMENT PURPOSE.
// PLEASE GET THIS URL FROM SERVER - GET v1/google/authurl. Need Authorization to proceed.
const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth?access_type=offline&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fdrive.metadata.readonly&state=5e4d98d7d909825d12d772ac&response_type=code&client_id=1007579191876-ulaimk2dhh0db93dvr7k3ttoqclp5rhf.apps.googleusercontent.com&redirect_uri=http%3A%2F%2Flocalhost%3A5000%2Fv1%2Fgoogle%2Fauthcallback';
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
  render() {
    const { logout } = this.props;

    return (
      <div className={s('p-lg')}>
        <a href={GOOGLE_AUTH_URL}>CONNECT GOOGLE</a>
        <Button
          color="primary"
          onClick={logout}
          text="Logout"
        />
      </div>
    );
  }
}

import React, { Component, PropTypes } from 'react';
import Button from '../../components/common/Button';

import { logout } from '../../actions/auth';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { getStyleApplicationFn } from '../../utils/styleHelpers';
const s = getStyleApplicationFn();

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
      <div className={s("p-lg")}>
        <Button
        	color="primary"
        	onClick={logout}
        	text="Logout"
        />
      </div>
    );
  }
}

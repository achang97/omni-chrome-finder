import React, { Component } from 'react';

import AuthView from '../../components/auth/AuthView';
import { updateLoginEmail, updateLoginPassword, requestLogin } from '../../actions/auth';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { getStyleApplicationFn } from '../../utils/style';
const s = getStyleApplicationFn();

const Login = ({ requestLogin, updateLoginEmail, loginError, updateLoginPassword, loginEmail, loginPassword, isLoggingIn }) => (
  <AuthView
    title="Sign in to continue"
    isLoading={isLoggingIn}
    inputBody={
      <React.Fragment>
        <input
          type="text"
          value={loginEmail}
          placeholder="Email"
          className={s('w-full mb-sm text-xs')}
          onChange={e => updateLoginEmail(e.target.value)}
        />
        <input
          type="password"
          value={loginPassword}
          placeholder="Password"
          className={s('w-full text-xs')}
          onChange={e => updateLoginPassword(e.target.value)}
        />
        {/*<div className={s('text-xs text-gray-dark mt-reg self-end')}>Forgot password?</div>*/}
      </React.Fragment>
    }
    error={loginError}
    submitButtonProps={{
      text: 'Login',
      onClick: requestLogin,
      disabled: loginEmail === '' || loginPassword === '' || isLoggingIn
    }}
    footerLink="/signup"
    footerText="Don't have an account? Sign up"
  />
);

export default connect(
  state => ({
    loginEmail: state.auth.loginEmail,
    loginPassword: state.auth.loginPassword,
    loginError: state.auth.loginError,
    isLoggingIn: state.auth.isLoggingIn,
  }),
  dispatch =>
    bindActionCreators(
      {
        requestLogin,
        updateLoginEmail,
        updateLoginPassword,
      },
      dispatch
    )
)(Login);

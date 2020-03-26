import React, { Component } from 'react';

import AuthView from '../../components/auth/AuthView';
import { updateSignupFirstName, updateSignupLastName, updateSignupEmail, updateSignupPassword, updateSignupConfirmPassword, requestSignup } from '../../actions/auth';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { getStyleApplicationFn } from '../../utils/style';
const s = getStyleApplicationFn();

const Signup = ({
  signupFirstName, signupLastName, signupEmail, signupPassword, isSigningUp, signupError,
  updateSignupFirstName, updateSignupLastName, updateSignupEmail, updateSignupPassword, requestSignup
}) => (
  <AuthView
    title="Sign up to continue"
    isLoading={isSigningUp}
    inputBody={
      <React.Fragment>
        <div className={s('flex mb-sm ')}>
          <input
            type="text"
            value={signupFirstName}
            placeholder="First name"
            className={s('flex-1 text-xs mr-xs')}
            onChange={e => updateSignupFirstName(e.target.value)}
          />
          <input
            type="text"
            value={signupLastName}
            placeholder="Last name"
            className={s('flex-1 text-xs ml-xs')}
            onChange={e => updateSignupLastName(e.target.value)}
          />
        </div>
        <input
          type="text"
          value={signupEmail}
          placeholder="Email"
          className={s('w-full text-xs mb-sm ')}
          onChange={e => updateSignupEmail(e.target.value)}
        />
        <input
          type="password"
          value={signupPassword}
          placeholder="Password"
          className={s('w-full text-xs mb-sm')}
          onChange={e => updateSignupPassword(e.target.value)}
        />
      </React.Fragment>
    }
    error={signupError}
    submitButtonProps={{
      text: 'Signup',
      onClick: requestSignup,
      disabled: signupFirstName === '' || signupLastName === '' || signupEmail === '' || 
        signupPassword === '' || isSigningUp
    }}
    footerLink="/login"
    footerText="Already have an account? Sign in"
  />
);

export default connect(
  state => ({
    signupFirstName: state.auth.signupFirstName,
    signupLastName: state.auth.signupLastName,
    signupEmail: state.auth.signupEmail,
    signupPassword: state.auth.signupPassword,
    isSigningUp: state.auth.isSigningUp,
    signupError: state.auth.signupError
  }),
  dispatch =>
    bindActionCreators(
      {
        updateSignupFirstName,
        updateSignupLastName,
        updateSignupEmail,
        updateSignupPassword,
        requestSignup
      },
      dispatch
    )
)(Signup);
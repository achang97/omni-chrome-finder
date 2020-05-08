import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import AuthView from 'components/auth/AuthView';
import { ROUTES } from 'appConstants';

import { getStyleApplicationFn } from 'utils/style';

const s = getStyleApplicationFn();

const Signup = ({
  signupFirstName,
  signupLastName,
  signupEmail,
  signupPassword,
  isSigningUp,
  signupError,
  updateSignupFirstName,
  updateSignupLastName,
  updateSignupEmail,
  updateSignupPassword,
  requestSignup
}) => (
  <AuthView
    title="Welcome"
    subtitle="Sign up to continue"
    isLoading={isSigningUp}
    inputBody={
      <>
        <div className={s('flex')}>
          <input
            type="text"
            value={signupFirstName}
            placeholder="First name"
            className={s('flex-1 mr-xs')}
            onChange={(e) => updateSignupFirstName(e.target.value)}
          />
          <input
            type="text"
            value={signupLastName}
            placeholder="Last name"
            className={s('flex-1 ml-xs')}
            onChange={(e) => updateSignupLastName(e.target.value)}
          />
        </div>
        <input
          type="text"
          value={signupEmail}
          placeholder="Email"
          onChange={(e) => updateSignupEmail(e.target.value)}
        />
        <input
          type="password"
          value={signupPassword}
          placeholder="Password"
          onChange={(e) => updateSignupPassword(e.target.value)}
        />
      </>
    }
    error={signupError}
    submitButtonProps={{
      text: 'Signup',
      onClick: requestSignup,
      disabled:
        signupFirstName === '' ||
        signupLastName === '' ||
        signupEmail === '' ||
        signupPassword === '' ||
        isSigningUp
    }}
    footer={
      <Link to={ROUTES.LOGIN} className={s('text-xs text-gray-dark text-center block')}>
        Already have an account? Sign in
      </Link>
    }
  />
);

export default Signup;

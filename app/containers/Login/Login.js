import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import AuthView from 'components/auth/AuthView';
import { ROUTES } from 'appConstants';

import { getStyleApplicationFn } from 'utils/style';
const s = getStyleApplicationFn();

const Login = ({
  updateLoginEmail, loginError, updateLoginPassword, loginEmail, loginPassword, isLoggingIn,
  requestLogin
}) => (
  <AuthView
    title="Welcome!"
    subtitle="Sign in to continue"
    isLoading={isLoggingIn}
    inputBody={
      <React.Fragment>
        <input
          type="text"
          value={loginEmail}
          placeholder="Email"
          className={s('w-full')}
          onChange={e => updateLoginEmail(e.target.value)}
        />
        <input
          type="password"
          value={loginPassword}
          placeholder="Password"
          className={s('w-full')}
          onChange={e => updateLoginPassword(e.target.value)}
        />
        <Link
          to={ROUTES.FORGOT_PASSWORD}
          className={s('text-xs text-gray-light text-right block')}
        >
          Forgot password?
        </Link>
      </React.Fragment>
    }
    error={loginError}
    submitButtonProps={{
      text: 'Login',
      onClick: requestLogin,
      disabled: loginEmail === '' || loginPassword === '' || isLoggingIn
    }}
    footer={
      <Link
        to={ROUTES.SIGNUP}
        className={s('text-xs text-gray-dark text-center block')}
      >
        Don't have an account? Sign up
      </Link>
    }
  />
);

export default Login;
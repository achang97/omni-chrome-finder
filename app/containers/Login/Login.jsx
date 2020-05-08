import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import AuthView from 'components/auth/AuthView';
import { ROUTES, URL, WEB_APP_ROUTES } from 'appConstants';

import { getStyleApplicationFn } from 'utils/style';

const s = getStyleApplicationFn();

const Login = ({
  updateLoginEmail,
  loginError,
  updateLoginPassword,
  loginEmail,
  loginPassword,
  isLoggingIn,
  requestLogin
}) => (
  <AuthView
    title="Welcome!"
    subtitle="Sign in to continue"
    isLoading={isLoggingIn}
    inputBody={
      <>
        <input
          type="text"
          value={loginEmail}
          placeholder="Email"
          onChange={(e) => updateLoginEmail(e.target.value)}
        />
        <input
          type="password"
          value={loginPassword}
          placeholder="Password"
          onChange={(e) => updateLoginPassword(e.target.value)}
        />
        <Link to={ROUTES.FORGOT_PASSWORD} className={s('text-xs text-gray-light text-right block')}>
          Forgot password?
        </Link>
      </>
    }
    error={loginError}
    submitButtonProps={{
      text: 'Login',
      onClick: requestLogin,
      disabled: loginEmail === '' || loginPassword === '' || isLoggingIn
    }}
    footer={
      <a
        href={`${URL.WEB_APP}${WEB_APP_ROUTES.SIGNUP}`}
        target="_blank"
        className={s('text-xs text-gray-dark text-center block')}
      >
        Don't have an account? Sign up
      </a>
    }
  />
);

export default Login;

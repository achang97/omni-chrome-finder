import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import AuthView from 'components/auth/AuthView';
import { ROUTES, URL, WEB_APP_ROUTES } from 'appConstants';

import { getStyleApplicationFn } from 'utils/style';

const s = getStyleApplicationFn();

const Login = ({
  loginError,
  loginEmail,
  loginPassword,
  isLoggingIn,
  updateLoginEmail,
  updateLoginPassword,
  requestLogin
}) => {
  const renderInputBody = () => (
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
  );

  const renderFooter = () => (
    <a
      href={`${URL.WEB_APP}${WEB_APP_ROUTES.SIGNUP}`}
      target="_blank"
      rel="noopener noreferrer"
      className={s('text-xs text-gray-dark text-center block')}
    >
      Don&apos;t have an account? Sign up
    </a>
  );

  return (
    <AuthView
      title="Welcome!"
      subtitle="Sign in to continue"
      isLoading={isLoggingIn}
      inputBody={renderInputBody()}
      error={loginError}
      submitButtonProps={{
        text: 'Login',
        onClick: requestLogin,
        disabled: loginEmail === '' || loginPassword === '' || isLoggingIn
      }}
      footer={renderFooter()}
    />
  );
};

Login.propTypes = {
  // Redux State
  loginEmail: PropTypes.string.isRequired,
  loginPassword: PropTypes.string.isRequired,
  isLoggingIn: PropTypes.bool,
  loginError: PropTypes.string,

  // Redux Actions
  requestLogin: PropTypes.func.isRequired,
  updateLoginEmail: PropTypes.func.isRequired,
  updateLoginPassword: PropTypes.func.isRequired
};

Login.defaultProps = {
  isLoggingIn: false,
  loginError: null
};

export default Login;

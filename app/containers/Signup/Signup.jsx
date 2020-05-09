import React from 'react';
import PropTypes from 'prop-types';
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
}) => {
  const renderInputBody = () => (
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
  );

  const renderFooter = () => (
    <Link to={ROUTES.LOGIN} className={s('text-xs text-gray-dark text-center block')}>
      Already have an account? Sign in
    </Link>
  );

  return (
    <AuthView
      title="Welcome"
      subtitle="Sign up to continue"
      isLoading={isSigningUp}
      inputBody={renderInputBody()}
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
      footer={renderFooter()}
    />
  );
};

Signup.propTypes = {
  signupFirstName: PropTypes.string.isRequired,
  signupLastName: PropTypes.string.isRequired,
  signupEmail: PropTypes.string.isRequired,
  signupPassword: PropTypes.string.isRequired,
  isSigningUp: PropTypes.bool,
  signupError: PropTypes.string,

  // Redux Actions
  updateSignupFirstName: PropTypes.func.isRequired,
  updateSignupLastName: PropTypes.func.isRequired,
  updateSignupEmail: PropTypes.func.isRequired,
  updateSignupPassword: PropTypes.func.isRequired,
  requestSignup: PropTypes.func.isRequired
};

Signup.defaultProps = {
  isSigningUp: true,
  signupError: null
};

export default Signup;

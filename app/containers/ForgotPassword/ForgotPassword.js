import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import AuthView from 'components/auth/AuthView';
import Message from 'components/common/Message';

import { ROUTES } from 'appConstants';

import { getStyleApplicationFn } from 'utils/style';

const s = getStyleApplicationFn();

const ForgotPassword = ({
  recoveryEmail,
  isSendingRecoveryEmail,
  recoverySuccess,
  recoveryError,
  updateRecoveryEmail,
  requestSendRecoveryEmail,
  history
}) => {
  return (
    <AuthView
      title="Forgot Password?"
      subtitle="Enter your recovery email"
      isLoading={isSendingRecoveryEmail}
      inputBody={
        recoverySuccess ? (
          <Message message="Successfully sent recovery email!" type="success" />
        ) : (
          <input
            value={recoveryEmail}
            placeholder="Enter your recovery email"
            onChange={(e) => updateRecoveryEmail(e.target.value)}
          />
        )
      }
      error={recoveryError}
      submitButtonProps={
        recoverySuccess
          ? {
              text: 'Back to sign in',
              onClick: () => history.push(ROUTES.LOGIN)
            }
          : {
              text: 'Send recovery email',
              onClick: requestSendRecoveryEmail,
              disabled: recoveryEmail === ''
            }
      }
      footer={
        <Link to={ROUTES.LOGIN} className={s('text-xs text-gray-dark text-center block')}>
          Back to sign in
        </Link>
      }
    />
  );
};

export default ForgotPassword;

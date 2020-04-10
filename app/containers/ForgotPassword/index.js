import React, { Component } from 'react';
import AnimateHeight from 'react-animate-height';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import AuthView from '../../components/auth/AuthView';
import Message from '../../components/common/Message';
import { requestSendRecoveryEmail, updateRecoveryEmail } from '../../actions/auth';

import { ROUTES } from '../../utils/constants';

import style from './forgot-password.css';
import { getStyleApplicationFn } from '../../utils/style';
const s = getStyleApplicationFn(style);

const ForgotPassword = ({
  recoveryEmail, isSendingRecoveryEmail, recoverySuccess, recoveryError,
  updateRecoveryEmail, requestSendRecoveryEmail, history
}) => {
  return (
    <AuthView
      title="Forgot Password?"
      subtitle="Enter your recovery email"
      isLoading={isSendingRecoveryEmail}
      inputBody={ recoverySuccess ?
        <Message
          message="Successfully sent recovery email!"
          type="success"
        /> :
        <input
          value={recoveryEmail}
          placeholder="Enter your recovery email"
          onChange={e => updateRecoveryEmail(e.target.value)}
          className={s('w-full')}
        />
      }
      error={recoveryError}
      submitButtonProps={ recoverySuccess ?
        {
          text: 'Back to sign in',
          onClick: () => history.push(ROUTES.LOGIN)
        } :
        {
          text: 'Send recovery email',
          onClick: requestSendRecoveryEmail,
          disabled: recoveryEmail === ''
        }
      }
      footer={
        <Link
          to={ROUTES.LOGIN}
          className={s('text-xs text-gray-dark text-center block')}
        >
          Back to sign in
        </Link>  
      }
    />
  );
}

export default connect(
  state => ({
    recoveryEmail: state.auth.recoveryEmail,
    isSendingRecoveryEmail: state.auth.isSendingRecoveryEmail,
    recoverySuccess: state.auth.recoverySuccess,
    recoveryError: state.auth.recoveryError,
  }),
  dispatch =>
    bindActionCreators(
      {
        updateRecoveryEmail,
        requestSendRecoveryEmail
      },
      dispatch
    )
)(ForgotPassword);

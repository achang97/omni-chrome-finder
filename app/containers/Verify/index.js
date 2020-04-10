import React, { useEffect } from 'react';
import AnimateHeight from 'react-animate-height';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import AuthView from '../../components/auth/AuthView';
import Loader from '../../components/common/Loader';
import Message from '../../components/common/Message';
import Separator from '../../components/common/Separator';

import { updateVerificationCode, requestVerify, requestResendVerificationEmail, clearResendVerificationInfo, logout } from '../../actions/auth';
import { requestGetUser } from '../../actions/profile';

import style from './verify.css';
import { getStyleApplicationFn } from '../../utils/style';
const s = getStyleApplicationFn(style);

const Verify = ({
  verificationCode, isVerifying, verifyError, isGettingUser,
  isResendingVerification, resendVerificationSuccess, resendVerificationError,
  updateVerificationCode, requestVerify, requestResendVerificationEmail, requestGetUser, logout
}) => {
  const renderFooter = () => (
    <>
      <Separator horizontal className={s('m-0')}/>
      <div className={s('flex justify-between mt-lg text-xs text-gray-dark')}>
        <div>
          <div onClick={requestResendVerificationEmail} className={s('flex cursor-pointer')}>
            <span className={s('mr-xs')}> Re-send verification code </span>
            {isResendingVerification && <Loader size="xs" className={s('ml-sm')} />}
          </div>     
          <Message message="Sent verification code!" type="success" className={s('mt-sm text-xs text-left')} show={!!resendVerificationSuccess} animate temporary />
          <Message className={s('mt-sm text-xs text-left')} message={resendVerificationError} type="error" />
        </div> 
        <div className={s('cursor-pointer')} onClick={logout}>
          Logout
        </div>  
      </div>
    </>
  );

  return (
    <AuthView
      title="Verify your account"
      className={s('text-center')}
      isLoading={isVerifying}
      inputBody={
        <>
          <input
            value={verificationCode}
            placeholder="Verification code"
            onChange={e => updateVerificationCode(e.target.value)}
            className={s('mt-reg w-full')}
          />
          <div className={s('flex justify-end')}>
            <div className={s('text-gray-dark text-xs cursor-pointer mr-sm')} onClick={requestGetUser}>
              Already verified? Click to refresh
            </div>
            { isGettingUser &&
              <Loader size="xs" />            
            }
          </div>

        </>
      }
      error={verifyError}
      submitButtonProps={{
        text: 'Verify',
        onClick: requestVerify,
        disabled: verificationCode === ''
      }}
      footer={renderFooter()}
    />
  );
}

export default connect(
  state => ({
    verificationCode: state.auth.verificationCode,
    isVerifying: state.auth.isVerifying,
    verifyError: state.auth.verifyError,
    isResendingVerification: state.auth.isResendingVerification,
    resendVerificationSuccess: state.auth.resendVerificationSuccess,
    resendVerificationError: state.auth.resendVerificationError,
    isGettingUser: state.profile.isGettingUser,
  }),
  dispatch =>
    bindActionCreators(
      {
        updateVerificationCode,
        requestVerify,
        requestResendVerificationEmail,
        clearResendVerificationInfo,
        requestGetUser,
        logout
      },
      dispatch
    )
)(Verify);

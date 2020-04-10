import React, { Component } from 'react';
import AnimateHeight from 'react-animate-height';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import Message from '../../components/common/Message';
import Separator from '../../components/common/Separator';

import { updateVerificationCode, requestVerify, requestResendVerificationEmail, clearResendVerificationInfo, logout } from '../../actions/auth';
import { TIMEOUT_3S } from '../../utils/constants';

import style from './verify.css';
import { getStyleApplicationFn } from '../../utils/style';
const s = getStyleApplicationFn(style);

import logo from '../../assets/images/logos/logo.svg';

class Verify extends Component {
  componentDidUpdate(prevProps) {
    if (!prevProps.resendVerificationSuccess && this.props.resendVerificationSuccess) {
      setTimeout(this.props.clearResendVerificationInfo, TIMEOUT_3S);
    }
  }

  render() {
    const {
      verificationCode, isVerifying, verifyError,
      isResendingVerification, resendVerificationSuccess, resendVerificationError,
      updateVerificationCode, requestVerify, requestResendVerificationEmail, logout
    } = this.props;

    return (
      <div className={s('flex-1 flex flex-col items-center py-2xl px-3xl')}>
        <img src={logo} className={s('h-4xl mb-lg')} />
        <div className={s('text-xl font-semibold')}>Verify your account</div>
        <div className={s('text-sm text-gray-dark mt-reg mb-2xl')}> Enter the verification code sent to your email. </div>
        <div className={s('my-sm w-full')}>
          { isVerifying ?
            <Loader className={s('mb')} /> :
            <input
              value={verificationCode}
              placeholder="Verification code"
              onChange={e => updateVerificationCode(e.target.value)}
              className={s('w-full text-xs')}
            />
          }
        </div>
        <Button
          color="primary"
          text="Verify"
          onClick={requestVerify}
          disabled={verificationCode === ''}
          className={s('self-stretch')}
        />
        <Message className={s('my-sm')} message={verifyError} type="error" />
        <Separator horizontal className={s('my-reg')} />
        <Button
          color="transparent"
          text="Re-send verification code"
          className={s('self-stretch p-sm')}
          icon={isResendingVerification ? <Loader size="xs" className={s('ml-sm')} /> : null}
          iconLeft={false}
          onClick={requestResendVerificationEmail}
        />
        <AnimateHeight height={resendVerificationSuccess ? 'auto' : 0}>
          <div className={s('mt-reg text-sm text-center text-green-reg')}>
            Sent verification code!
          </div>
        </AnimateHeight>
        <Message className={s('mt-sm')} message={resendVerificationError} type="error" />
        <div
          className={s('text-xs text-gray-dark cursor-pointer mt-lg self-end')}
          onClick={logout}
        >
          Logout
        </div>
      </div>
    );    
  }
}

export default connect(
  state => ({
    verificationCode: state.auth.verificationCode,
    isVerifying: state.auth.isVerifying,
    verifyError: state.auth.verifyError,
    isResendingVerification: state.auth.isResendingVerification,
    resendVerificationSuccess: state.auth.resendVerificationSuccess,
    resendVerificationError: state.auth.resendVerificationError,
  }),
  dispatch =>
    bindActionCreators(
      {
        updateVerificationCode,
        requestVerify,
        requestResendVerificationEmail,
        clearResendVerificationInfo,
        logout
      },
      dispatch
    )
)(Verify);

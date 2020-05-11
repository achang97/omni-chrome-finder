import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { AuthView } from 'components/auth';
import { Loader, Message, Separator } from 'components/common';
import { getStyleApplicationFn } from 'utils/style';

const s = getStyleApplicationFn();

const Verify = ({
  dockVisible,
  verificationCode,
  isVerifying,
  verifyError,
  isGettingUser,
  isResendingVerification,
  resendVerificationSuccess,
  resendVerificationError,
  updateVerificationCode,
  requestVerify,
  requestResendVerificationEmail,
  requestGetUser,
  logout
}) => {
  useEffect(() => {
    if (dockVisible) {
      requestGetUser();
    }
  }, [dockVisible, requestGetUser]);

  const renderFooter = () => (
    <>
      <Separator horizontal className={s('m-0')} />
      <div className={s('flex justify-between mt-lg text-xs text-gray-dark')}>
        <div>
          <div onClick={requestResendVerificationEmail} className={s('flex cursor-pointer')}>
            <span className={s('mr-xs')}> Re-send verification code </span>
            {isResendingVerification && <Loader size="xs" className={s('ml-sm')} />}
          </div>
          <Message
            message="Sent verification code!"
            type="success"
            className={s('mt-sm text-xs text-left')}
            show={!!resendVerificationSuccess}
            animate
            temporary
          />
          <Message
            className={s('mt-sm text-xs text-left')}
            message={resendVerificationError}
            type="error"
          />
        </div>
        <div className={s('cursor-pointer')} onClick={logout}>
          Logout
        </div>
      </div>
    </>
  );

  const renderInputBody = () => (
    <>
      <input
        value={verificationCode}
        placeholder="Verification code"
        onChange={(e) => updateVerificationCode(e.target.value)}
        className={s('mt-reg')}
      />
      <div className={s('flex justify-end')}>
        <div className={s('text-gray-dark text-xs cursor-pointer mr-sm')} onClick={requestGetUser}>
          Already verified? Click to refresh
        </div>
        {isGettingUser && <Loader size="xs" />}
      </div>
    </>
  );

  return (
    <AuthView
      title="Verify your account"
      className={s('text-center')}
      isLoading={isVerifying}
      inputBody={renderInputBody()}
      error={verifyError}
      submitButtonProps={{
        text: 'Verify',
        onClick: requestVerify,
        disabled: verificationCode === ''
      }}
      footer={renderFooter()}
    />
  );
};

Verify.propTypes = {
  // Redux State
  dockVisible: PropTypes.bool.isRequired,
  verificationCode: PropTypes.string.isRequired,
  isVerifying: PropTypes.bool,
  verifyError: PropTypes.string,
  isGettingUser: PropTypes.bool,
  isResendingVerification: PropTypes.bool,

  // Redux Actions
  resendVerificationSuccess: PropTypes.func.isRequired,
  resendVerificationError: PropTypes.func.isRequired,
  updateVerificationCode: PropTypes.func.isRequired,
  requestVerify: PropTypes.func.isRequired,
  requestResendVerificationEmail: PropTypes.func.isRequired,
  requestGetUser: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired
};

export default Verify;

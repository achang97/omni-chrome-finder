import { connect } from 'react-redux';
import {
  updateVerificationCode,
  requestVerify,
  requestResendVerificationEmail,
  clearResendVerificationInfo,
  logout
} from 'actions/auth';
import { requestGetUser } from 'actions/profile';
import Verify from './Verify';

const mapStateToProps = (state) => {
  const {
    auth: {
      verificationCode,
      isVerifying,
      verifyError,
      isResendingVerification,
      resendVerificationSuccess,
      resendVerificationError,
      isGettingUser
    },
    display: { dockVisible }
  } = state;

  return {
    dockVisible,
    verificationCode,
    isVerifying,
    verifyError,
    isResendingVerification,
    resendVerificationSuccess,
    resendVerificationError,
    isGettingUser
  };
};

const mapDispatchToProps = {
  updateVerificationCode,
  requestVerify,
  requestResendVerificationEmail,
  clearResendVerificationInfo,
  requestGetUser,
  logout
};

export default connect(mapStateToProps, mapDispatchToProps)(Verify);

import { connect } from 'react-redux';
import { requestSendRecoveryEmail, updateRecoveryEmail } from 'actions/auth';
import ForgotPassword from './ForgotPassword';

const mapStateToProps = (state) => {
  const {
    auth: { recoveryEmail, isSendingRecoveryEmail, recoverySuccess, recoveryError }
  } = state;

  return { recoveryEmail, isSendingRecoveryEmail, recoverySuccess, recoveryError };
};

const mapDispatchToProps = {
  updateRecoveryEmail,
  requestSendRecoveryEmail
};

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword);

import { connect } from 'react-redux';
import { updateSignupFirstName, updateSignupLastName, updateSignupEmail, updateSignupPassword, updateSignupConfirmPassword, requestSignup } from 'actions/auth';
import Signup from './Signup';

const mapStateToProps = (state) => {
  const { 
    auth: {
      signupFirstName,
      signupLastName,
      signupEmail,
      signupPassword,
      isSigningUp,
      signupError
    }
  } = state;

  return { signupFirstName, signupLastName, signupEmail, signupPassword, isSigningUp, signupError };
}

const mapDispatchToProps = {
  updateSignupFirstName,
  updateSignupLastName,
  updateSignupEmail,
  updateSignupPassword,
  requestSignup
}

export default connect(mapStateToProps, mapDispatchToProps)(Signup);
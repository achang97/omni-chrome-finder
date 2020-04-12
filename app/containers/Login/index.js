import { connect } from 'react-redux';
import { updateLoginEmail, updateLoginPassword, requestLogin } from '../../actions/auth';
import Login from './Login';

const mapStateToProps = (state) => {
  const { 
    auth: {
      loginEmail,
      loginPassword,
      loginError,
      isLoggingIn
    }
  } = state;

  return { loginEmail, loginPassword, loginError, isLoggingIn };
}

const mapDispatchToProps = {
  requestLogin,
  updateLoginEmail,
  updateLoginPassword,
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);



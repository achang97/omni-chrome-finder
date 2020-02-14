import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';

import { updateLoginEmail, updateLoginPassword, requestLogin } from '../../actions/auth';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import style from './login.css';
import { getStyleApplicationFn } from '../../utils/styleHelpers';
const s = getStyleApplicationFn(style);

import logo from '../../assets/images/logos/logo.png';

@connect(
  state => ({
    loginEmail: state.auth.loginEmail,
    loginPassword: state.auth.loginPassword,
    loginError: state.auth.loginError,
    isLoggingIn: state.auth.isLoggingIn,
  }),
  dispatch =>
    bindActionCreators(
      {
        requestLogin,
        updateLoginEmail,
        updateLoginPassword,
      },
      dispatch
    )
)

class Login extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { requestLogin, updateLoginEmail, loginError, updateLoginPassword, loginEmail, loginPassword, isLoggingIn } = this.props;

    return (
      <div className={s("flex-1 items-center px-lg pb-lg pt-3xl bg-purple-light")}>
        <img src={logo} className={s("w-1/2 mx-auto block mb-reg")} />
        { isLoggingIn ? 
          <Loader /> :
          <div>
            <div>
              <input
                type="text"
                value={loginEmail}
                placeholder="Enter login email"
                className={s("w-full mb-xs")}
                onChange={(e) => updateLoginEmail(e.target.value)}
              />
            </div>
            <div>
              <input
                type="password"
                value={loginPassword}
                placeholder="Enter password"
                className={s("w-full")}
                onChange={(e) => updateLoginPassword(e.target.value)}
              />
            </div>
          </div>
        }
        { loginError &&
          <div className={s("error-text mt-reg")}> {loginError} </div>
        }
        <Button
          color="primary"
          text="Login"
          className={s("mt-reg")}
          onClick={requestLogin}
          disabled={loginEmail === '' || loginPassword === ''}
        />
      </div>
    );    
  }
};

export default Login;

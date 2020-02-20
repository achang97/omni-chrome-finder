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
      <div className={s("flex-1 flex flex-col pt-3xl")}>
        <div className={s("px-2xl")}>
          <div className={s("text-xl")}>Welcome!</div>
          <div className={s("text-sm text-gray-dark mt-reg mb-2xl")}>Sign in to continue</div>
          { isLoggingIn ? 
            <Loader className={s("mb-reg")}/> :
            <div className={s("flex flex-col")}>
              <div>
                <input
                  type="text"
                  value={loginEmail}
                  placeholder="Enter login email"
                  className={s("w-full mb-reg text-xs")}
                  onChange={(e) => updateLoginEmail(e.target.value)}
                />
              </div>
              <div>
                <input
                  type="password"
                  value={loginPassword}
                  placeholder="Enter password"
                  className={s("w-full text-xs")}
                  onChange={(e) => updateLoginPassword(e.target.value)}
                />
              </div>
              <div className={s("text-xs text-gray-dark mt-reg mb-reg self-end")}>Forgot password?</div>
            </div>
          }
          { loginError &&
            <div className={s("error-text mt-reg")}> {loginError} </div>
          }
        </div>
        <div className={s("bg-purple-light p-2xl rounded-lg")}>
          <Button
            color="primary"
            text="Login"
            className={s("")}
            onClick={requestLogin}
            disabled={loginEmail === '' || loginPassword === ''}
          />
        </div>
      </div>
    );    
  }
};

export default Login;

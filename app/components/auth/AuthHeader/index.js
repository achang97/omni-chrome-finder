import React from 'react';
import PropTypes from 'prop-types';

import style from './auth-header.css';
import { getStyleApplicationFn } from 'utils/style';

import logo from 'assets/images/logos/logo-dark.svg';

const s = getStyleApplicationFn(style);

const AuthHeader = ({ children, className }) => (
  <div className={s(`auth-header ${className}`)}>
    <img src={logo} className={s('h-3xl mb-reg')} />
    { children }
  </div>
);

AuthHeader.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
}

AuthHeader.defaultProps = {
  className: '',
}

export default AuthHeader;
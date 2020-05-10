import React from 'react';
import PropTypes from 'prop-types';

import { getStyleApplicationFn } from 'utils/style';

import logo from 'assets/images/logos/logo-dark.svg';
import style from './auth-header.css';

const s = getStyleApplicationFn(style);

const AuthHeader = ({ children, className }) => (
  <div className={s(`auth-header ${className}`)}>
    <img src={logo} className={s('h-3xl mb-reg')} alt="Omni Logo" />
    {children}
  </div>
);

AuthHeader.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};

AuthHeader.defaultProps = {
  className: ''
};

export default AuthHeader;

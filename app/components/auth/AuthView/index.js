import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import Button from '../../../components/common/Button';
import Loader from '../../../components/common/Loader';
import ErrorMessage from '../../../components/common/ErrorMessage';

import logo from '../../../assets/images/logos/logo.svg';

import style from './auth-view.css';
import { getStyleApplicationFn } from '../../../utils/style';
const s = getStyleApplicationFn(style);

const AuthView = ({ title, isLoading, inputBody, error, submitButtonProps, footerText, footerLink, history }) => {
  return (
    <div className={s('flex-1 flex flex-col pt-3xl')}>
      <div className={s('px-2xl')}>
        <div className={s('flex justify-between')}>
          <div>
            <div className={s('text-xl font-semibold')}>Welcome!</div>
            <div className={s('text-sm text-gray-dark mt-reg mb-2xl')}> {title} </div>
          </div>
          <img src={logo} className={s('h-4xl')} />
        </div>
        { isLoading ?
          <Loader className={s('mb-reg')} /> :
          <div className={s('auth-view-input-body mb-reg')}>
            {inputBody}
          </div>
        }
        <ErrorMessage className={s('my-reg')} error={error} />
      </div>
      <div className={s('bg-purple-light p-2xl rounded-lg')}>
        <Button
          color="primary"
          {...submitButtonProps}
        />
        <div
          className={s('text-xs text-gray-dark text-center cursor-pointer mt-reg')}
          onClick={() => history.push(footerLink)}
        >
          {footerText}
        </div>
      </div>
    </div>
  );
};

AuthView.propTypes = {
  title: PropTypes.string.isRequired,
  isLoading: PropTypes.bool,
  inputBody: PropTypes.element.isRequired,
  error: PropTypes.string,
  submitButtonProps: PropTypes.object,
  footerText: PropTypes.string.isRequired,
  footerLink: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired
};

AuthView.defaultProps = {
  isLoading: false,
}

export default withRouter(AuthView);

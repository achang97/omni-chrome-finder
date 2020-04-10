import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import Button from '../../../components/common/Button';
import Loader from '../../../components/common/Loader';
import Message from '../../../components/common/Message';

import logo from '../../../assets/images/logos/logo-dark.svg';

import style from './auth-view.css';
import { getStyleApplicationFn } from '../../../utils/style';
const s = getStyleApplicationFn(style);

const AuthView = ({
  title, subtitle, isLoading, inputBody, error, footer, className,
  submitButtonProps: { onClick: buttonOnClick, disabled: buttonDisabled, ...restButtonProps }, 
}) => {
  const disabled = isLoading || buttonDisabled;

  const protectedOnClick = (e) => {
    e.preventDefault();
    if (buttonOnClick && !disabled) buttonOnClick();
  }

  return (
    <form onSubmit={protectedOnClick} className={s(`m-0 flex-1 flex flex-col pt-2xl ${className}`)}>
      <div className={s('px-2xl')}>
        <img src={logo} className={s('h-3xl mb-reg')} />
          { title &&
            <div>
              <div className={s('font-semibold mb-reg')}> {title} </div>
            </div>
          }
          { subtitle &&
            <div>
              <div className={s('text-sm text-gray-light mb-xl')}> {subtitle} </div>
            </div>
          }
          { isLoading ?
            <Loader className={s('mb-reg')} /> :
            <div className={s('auth-view-input-body mb-reg')}>
              {inputBody}
            </div>
          }          
        <Message className={s('my-reg')} message={error} type="error" />
      </div>
      <div className={s('bg-purple-light p-2xl rounded-lg')}>
        <Button
          type="submit"
          color="primary"
          containerClassName={s(`w-full ${footer ? 'mb-reg' : ''}`)}
          disabled={disabled}
          {...restButtonProps}
        />
        {footer}
      </div>
    </form>
  );
};

AuthView.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  isLoading: PropTypes.bool,
  inputBody: PropTypes.element.isRequired,
  error: PropTypes.string,
  submitButtonProps: PropTypes.object,
  footer: PropTypes.any,
  className: PropTypes.string,
};

AuthView.defaultProps = {
  isLoading: false,
  className: '',
}

export default withRouter(AuthView);

import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import { Button, Loader, Message } from 'components/common';
import { getStyleApplicationFn } from 'utils/style';
import AuthHeader from '../AuthHeader';

import style from './auth-view.css';

const s = getStyleApplicationFn(style);

const AuthView = ({
  title,
  subtitle,
  isLoading,
  inputBody,
  error,
  footer,
  className,
  submitButtonProps: { onClick: buttonOnClick, disabled: buttonDisabled, ...restButtonProps }
}) => {
  const disabled = isLoading || buttonDisabled;

  const protectedOnClick = (e) => {
    if (e) e.preventDefault();
    if (buttonOnClick && !disabled) buttonOnClick();
  };

  return (
    <form onSubmit={protectedOnClick} className={s(`m-0 flex-1 flex flex-col ${className}`)}>
      <AuthHeader>
        {title && (
          <div>
            <div className={s('font-semibold mb-reg')}> {title} </div>
          </div>
        )}
        {subtitle && (
          <div>
            <div className={s('text-sm text-gray-reg mb-xl')}> {subtitle} </div>
          </div>
        )}
        {isLoading ? (
          <Loader className={s('mb-reg')} />
        ) : (
          <div className={s('auth-view-input-body mb-reg')}>{inputBody}</div>
        )}
        <Message className={s('my-reg')} message={error} type="error" />
      </AuthHeader>
      <div className={s('bg-purple-light p-2xl rounded-lg')}>
        {/* Avoid using actual button due to weird styling across pages */}
        <input className={s('hidden')} type="submit" />
        <Button
          color="primary"
          disabled={disabled}
          className={s('mb-sm')}
          onClick={protectedOnClick}
          {...restButtonProps}
        />
        {footer}
      </div>
    </form>
  );
};

AuthView.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  isLoading: PropTypes.bool,
  inputBody: PropTypes.node.isRequired,
  error: PropTypes.string,
  submitButtonProps: PropTypes.shape(Button.propTypes).isRequired,
  footer: PropTypes.node,
  className: PropTypes.string
};

AuthView.defaultProps = {
  isLoading: false,
  className: ''
};

export default withRouter(AuthView);

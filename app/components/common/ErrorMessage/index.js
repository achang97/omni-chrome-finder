import React from 'react';
import PropTypes from 'prop-types';

import style from './error.css';
import { getStyleApplicationFn } from '../../../utils/style';

const s = getStyleApplicationFn(style);

const ErrorMessage = ({ error, className, ...rest }) => (
  error ?
    <div className={s(`${className} error-text`)} {...rest}>
      {error}
    </div> :
    null
);

ErrorMessage.propTypes = {
  error: PropTypes.string,
}

export default ErrorMessage;
import React from 'react';
import PropTypes from 'prop-types';

import style from './separator.css';
import { getStyleApplicationFn } from 'utils/style';

const s = getStyleApplicationFn(style);

const Separator = ({ horizontal, className, ...rest }) => (
  <div
    className={s(`${className} ${horizontal ? 'separator-horizontal' : 'separator-vertical'}`)}
    {...rest}
  />
);

Separator.propTypes = {
  horizontal: PropTypes.bool,
  className: PropTypes.string,
}

Separator.defaultProps = {
  horizontal: false,
  className: '',
}

export default Separator;
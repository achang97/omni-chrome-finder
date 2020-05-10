import React from 'react';
import PropTypes from 'prop-types';

import { getStyleApplicationFn } from 'utils/style';
import style from './separator.css';

const s = getStyleApplicationFn(style);

const Separator = ({ horizontal, className }) => (
  <div
    className={s(`${className} ${horizontal ? 'separator-horizontal' : 'separator-vertical'}`)}
  />
);

Separator.propTypes = {
  horizontal: PropTypes.bool,
  className: PropTypes.string
};

Separator.defaultProps = {
  horizontal: false,
  className: ''
};

export default Separator;

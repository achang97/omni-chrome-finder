import React from 'react';
import PropTypes from 'prop-types';
import { getFileUrl } from 'utils/file';

import { getStyleApplicationFn } from 'utils/style';
import style from './placeholder-img.css';

const s = getStyleApplicationFn(style);

const NUM_COLORS = 3;

/* eslint-disable no-bitwise, no-param-reassign */
const hashCode = (string) =>
  Math.abs(
    string.split('').reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, 0)
  );
/* eslint-enable no-bitwise, no-param-reassign */

const getPlaceholder = (name, className) => {
  if (!name) return null;

  const bucket = hashCode(name) % NUM_COLORS;
  const tokens = name.trim().split(' ');
  const initials =
    tokens.length === 0
      ? ''
      : `${tokens[0][0]}${tokens.length > 1 ? tokens[tokens.length - 1][0] : ''}`;

  return (
    <div className={s(`placeholder-img placeholder-img-${bucket} ${className}`)}>{initials}</div>
  );
};

const PlaceholderImg = ({ name, src, className, isUrl, token }) =>
  src ? (
    <img src={isUrl ? src : getFileUrl(src, token)} className={className} alt={name} />
  ) : (
    getPlaceholder(name, className)
  );

PlaceholderImg.propTypes = {
  name: PropTypes.string.isRequired,
  src: PropTypes.string,
  className: PropTypes.string,
  isUrl: PropTypes.bool,

  // Redux State
  token: PropTypes.string.isRequired
};

PlaceholderImg.defaultProps = {
  className: '',
  src: null,
  isUrl: false
};

export default PlaceholderImg;

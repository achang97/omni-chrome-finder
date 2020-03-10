import React from 'react';
import PropTypes from 'prop-types';

import style from './placeholder-img.css';
import { getStyleApplicationFn } from '../../../utils/style';
const s = getStyleApplicationFn(style);

const NUM_COLORS = 3;

const hashCode = (s) => {
  return Math.abs(s.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0));              
}

const getPlaceholder = (name, className) => {
  if (!name) return null;
  
  const bucket = hashCode(name) % NUM_COLORS;
  const tokens = name.trim().split(' ');
  const initials = tokens.length === 0 ? '' : `${tokens[0][0]}${tokens.length > 1 ? tokens[tokens.length - 1][0] : ''}`

  return (
    <div className={s(`placeholder-img placeholder-img-${bucket} ${className}`)}>
      { initials }
    </div>
  );
}

export const PlaceholderImg = ({ name, src, className }) => {
  return (src ? <img src={src} className={className} /> : getPlaceholder(name, className));
}

PlaceholderImg.propTypes = {
  name: PropTypes.string.isRequired,
  src: PropTypes.string,
  className: PropTypes.string,
}

PlaceholderImg.defaultProps = {
  className: ''
}

export default PlaceholderImg;
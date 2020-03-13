import React from 'react';
import PropTypes from 'prop-types';

import { colors } from '../../../styles/colors';
import { MoonLoader } from 'react-spinners';

import style from './loader.css';
import { getStyleApplicationFn } from '../../../utils/style';

const s = getStyleApplicationFn(style);

const getSize = (size) => {
  if (typeof (size) === 'string') {
    switch (size) {
      case 'sm':
        return 15;
      case 'md':
        return 30;
      case 'lg':
        return 50;
    }
  }

  return size;
};

const Loader = ({ color, size, className, centered, ...rest }) => (
  <div className={s(`loader ${centered ? 'flex justify-center items-center' : ''} ${className}`)}>
    <MoonLoader
      color={color}
      size={getSize(size)}
      {...rest}
    />
  </div>
);

Loader.propTypes = {
  color: PropTypes.string,
  className: PropTypes.string,
  centered: PropTypes.bool,
  size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

Loader.defaultProps = {
  color: colors.purple.reg,
  size: 'md',
  centered: true,
  className: '',
};

export default Loader;

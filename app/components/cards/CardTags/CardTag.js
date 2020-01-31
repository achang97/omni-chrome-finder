import React from 'react';
import PropTypes from 'prop-types';

import style from './card-tags.css';
import { getStyleApplicationFn } from '../../../utils/styleHelpers';
const s = getStyleApplicationFn(style);

const CardTag = ({ text, onClick, className, ...rest }) => {
  return (
    <div onClick={onClick} {...rest} className={s(`card-tag button-hover ${className}`)}>
      {text}
    </div> 
  )
}

CardTag.propTypes = {
  text: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
  onClick: PropTypes.func,
  className: PropTypes.string,
}

CardTag.defaultProps = {
  className: '',
}

export default CardTag;
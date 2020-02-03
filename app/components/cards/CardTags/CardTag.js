import React from 'react';
import PropTypes from 'prop-types';

import { MdClose } from 'react-icons/md';

import style from './card-tags.css';
import { getStyleApplicationFn } from '../../../utils/styleHelpers';
const s = getStyleApplicationFn(style);

const CardTag = ({ text, onClick, onRemoveClick, className, ...rest }) => {
  const onRemove = (e) => {
    e.stopPropagation();
    onRemoveClick();
  }

  return (
    <div onClick={onClick} {...rest} className={s(`card-tag button-hover ${className}`)}>
      {text}
      { onRemoveClick &&
        <MdClose onClick={onRemove} className={s("ml-xs")} />
      }
    </div> 
  )
}

CardTag.propTypes = {
  text: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
  onClick: PropTypes.func,
  onRemoveClick: PropTypes.func,
  className: PropTypes.string,
}

CardTag.defaultProps = {
  className: '',
}

export default CardTag;
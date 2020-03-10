import React from 'react';
import PropTypes from 'prop-types';

import { MdClose } from 'react-icons/md';

import { NOOP } from '../../../utils/constants';

import style from './card-tags.css';
import { getStyleApplicationFn } from '../../../utils/style';
const s = getStyleApplicationFn(style);

const CardTag = React.forwardRef(({ text, onClick, onRemoveClick, className, ...rest }, ref) => {
  const onRemove = (e, text) => {
    e.stopPropagation();
    onRemoveClick(text);
  }

  const protectedOnClick = () => {
    if (onClick) onClick(text);
  }

  return (
    <div onClick={protectedOnClick} ref={ref} className={s(`card-tag ${onClick ? 'button-hover' : ''} ${className}`)} {...rest}>
      {text}
      { onRemoveClick &&
        <MdClose onClick={(e) => onRemove(e)} className={s("ml-xs button-hover")} />
      }
    </div> 
  )
});

CardTag.propTypes = {
  text: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
  onClick: PropTypes.func,
  onRemoveClick: PropTypes.func,
  className: PropTypes.string,
}

CardTag.defaultProps = {
  className: '',
  onClick: NOOP,
}

export default CardTag;
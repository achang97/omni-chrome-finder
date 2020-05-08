import React from 'react';
import PropTypes from 'prop-types';
import { MdClose, MdLock } from 'react-icons/md';

import { NOOP } from 'appConstants';

import { getStyleApplicationFn } from 'utils/style';
import style from './card-tag.css';

const s = getStyleApplicationFn(style);

const CardTag = React.forwardRef(
  ({ name, locked, onClick, onRemoveClick, className, ...rest }, ref) => {
    const onRemove = (e, name) => {
      e.stopPropagation();
      onRemoveClick(name);
    };

    const protectedOnClick = () => {
      if (onClick) onClick(name);
    };

    return (
      <div
        onClick={protectedOnClick}
        ref={ref}
        className={s(`card-tag ${onClick ? 'button-hover' : ''} ${className}`)}
        {...rest}
      >
        <div className={s('flex items-center')}>
          <div> {name} </div>
          {locked && <MdLock className={s('ml-xs')} />}
        </div>
        {onRemoveClick && (
          <MdClose onClick={(e) => onRemove(e)} className={s('ml-xs button-hover')} />
        )}
      </div>
    );
  }
);

CardTag.propTypes = {
  name: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
  locked: PropTypes.bool,
  onClick: PropTypes.func,
  onRemoveClick: PropTypes.func,
  className: PropTypes.string
};

CardTag.defaultProps = {
  className: '',
  onClick: NOOP,
  locked: false
};

export default CardTag;

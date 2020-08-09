import React from 'react';
import PropTypes from 'prop-types';
import { MdClose } from 'react-icons/md';

import { getStyleApplicationFn } from 'utils/style';
import style from './card-tag.css';

const s = getStyleApplicationFn(style);

const CardTag = React.forwardRef(({ name, onClick, onRemoveClick, className }, ref) => {
  const onRemove = (e) => {
    e.stopPropagation();
    onRemoveClick();
  };

  return (
    <div
      onClick={onClick}
      ref={ref}
      className={s(`card-tag ${onClick ? 'button-hover' : ''} ${className}`)}
    >
      <div> {name} </div>
      {onRemoveClick && <MdClose onClick={onRemove} className={s('ml-xs button-hover')} />}
    </div>
  );
});

CardTag.displayName = 'CardTag';

CardTag.propTypes = {
  name: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  onRemoveClick: PropTypes.func,
  className: PropTypes.string
};

CardTag.defaultProps = {
  className: ''
};

export default CardTag;

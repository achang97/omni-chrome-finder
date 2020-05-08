import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { MdClose } from 'react-icons/md';

import { CircleButton, PlaceholderImg, Tooltip } from 'components/common';
import { NOOP } from 'appConstants';

import { getStyleApplicationFn } from 'utils/style';
import style from './card-user.css';

const s = getStyleApplicationFn(style);

const CardUser = ({
  className,
  name,
  img,
  size,
  onClick,
  onRemoveClick,
  showName,
  showTooltip,
  ...rest
}) => {
  const protectedOnClick = () => {
    if (onClick) onClick({ img, name });
  };

  const [isHovering, setHover] = useState(false);

  return (
    <div className={s(`card-user ${className}`)} {...rest}>
      <div className={s('relative')}>
        <Tooltip tooltip={name}>
          <CircleButton
            content={
              <PlaceholderImg src={img} name={name} className={s('w-full h-full text-sm')} />
            }
            size={size}
            onClick={protectedOnClick}
          />
        </Tooltip>
        {onRemoveClick && (
          <button onClick={onRemoveClick} className={s('card-user-remove')}>
            <MdClose />
          </button>
        )}
      </div>
      {showName && <div className={s('card-user-label')}> {name} </div>}
    </div>
  );
};

CardUser.propTypes = {
  className: PropTypes.string,
  name: PropTypes.string.isRequired,
  img: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf(['xs', 'sm', 'md', 'lg'])]),
  onClick: PropTypes.func,
  onRemoveClick: PropTypes.func,
  showName: PropTypes.bool,
  showTooltip: PropTypes.bool
};

CardUser.defaultProps = {
  className: '',
  size: 'md',
  showName: true,
  showTooltip: false
};

export default CardUser;

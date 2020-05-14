import React from 'react';
import PropTypes from 'prop-types';
import { MdClose } from 'react-icons/md';

import { CircleButton, PlaceholderImg, Tooltip } from 'components/common';

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
  showTooltip
}) => {
  const protectedOnClick = () => {
    if (onClick) onClick({ img, name });
  };

  return (
    <div className={s(`card-user ${className}`)}>
      <Tooltip tooltip={name} show={showTooltip}>
        <div>
          <div className={s('relative')}>
            <CircleButton
              content={
                <PlaceholderImg src={img} name={name} className={s('w-full h-full text-sm')} />
              }
              size={size}
              onClick={protectedOnClick}
            />
            {onRemoveClick && (
              <button onClick={onRemoveClick} className={s('card-user-remove')} type="button">
                <MdClose />
              </button>
            )}
          </div>
          {showName && <div className={s('card-user-label')}> {name} </div>}
        </div>
      </Tooltip>
    </div>
  );
};

CardUser.propTypes = {
  className: PropTypes.string,
  name: PropTypes.string.isRequired,
  img: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf(['2xs', 'xs', 'sm', 'md', 'lg'])]),
  onClick: PropTypes.func,
  onRemoveClick: PropTypes.func,
  showName: PropTypes.bool,
  showTooltip: PropTypes.bool
};

CardUser.defaultProps = {
  className: '',
  size: 'md',
  showName: true,
  showTooltip: false,
  img: null,
  onClick: null,
  onRemoveClick: null
};

export default CardUser;

import React from 'react';
import PropTypes from 'prop-types';
import { MdClose } from 'react-icons/md';

import { CircleButton, PlaceholderImg, Tooltip } from 'components/common';
import { getUserName, isInvitedUser } from 'utils/user';
import { UserPropTypes } from 'utils/propTypes';

import { getStyleApplicationFn } from 'utils/style';
import style from './card-user.css';

const s = getStyleApplicationFn(style);

const CardUser = ({ user, className, size, onClick, onRemoveClick, showName, showTooltip }) => {
  const name = getUserName(user);
  const isInvited = isInvitedUser(user);

  const protectedOnClick = () => {
    if (onClick) onClick(user);
  };

  return (
    <div className={s(`card-user ${className}`)}>
      <Tooltip tooltip={name} show={showTooltip}>
        <div>
          <div className={s('relative')}>
            <CircleButton
              content={
                <PlaceholderImg
                  src={user.profilePicture}
                  name={name}
                  className={s(`
                    w-full h-full text-sm rounded-full
                    ${isInvited ? 'border-dashed border border-purple-gray-50 opacity-75' : ''}
                  `)}
                />
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
  size: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf(['2xs', 'xs', 'sm', 'md', 'lg'])]),
  onClick: PropTypes.func,
  onRemoveClick: PropTypes.func,
  showName: PropTypes.bool,
  showTooltip: PropTypes.bool,
  user: UserPropTypes.isRequired
};

CardUser.defaultProps = {
  className: '',
  size: 'md',
  showName: true,
  showTooltip: false,
  onClick: null,
  onRemoveClick: null
};

export default CardUser;

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { MdClose } from 'react-icons/md';
import CircleButton from '../../common/CircleButton';
import PlaceholderImg from '../../common/PlaceholderImg';

import { NOOP } from '../../../utils/constants';

import style from './card-users.css';
import { getStyleApplicationFn } from '../../../utils/style';

const s = getStyleApplicationFn(style);

const CardUser = ({ className, name, img, size, onClick, onRemoveClick, showName, ...rest }) => {
  const protectedOnClick = () => {
    if (onClick) onClick({ img, name });
  };

  return (
    <div className={s(`card-user ${className} ${onRemoveClick ? 'pr-sm pt-sm' : ''}`)} {...rest}>
      <CircleButton
        content={<PlaceholderImg src={img} name={name} className={s('w-full h-full')} />}
        size={size}
        label={showName ? name : null}
        labelClassName={s('card-user-label')}
        onClick={protectedOnClick}
      />
      { onRemoveClick &&
      <button onClick={onRemoveClick} className={s('absolute top-0 right-0 text-purple-gray-50')}>
        <MdClose />
      </button>
      }
    </div>
  );
};

CardUser.propTypes = {
  className: PropTypes.string,
  name: PropTypes.string.isRequired,
  img: PropTypes.string,
  size: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.oneOf(['sm', 'md', 'lg'])
  ]),
  onClick: PropTypes.func,
  onRemoveClick: PropTypes.func,
  showName: PropTypes.bool,
};

CardUser.defaultProps = {
  className: '',
  size: 'md',
  showName: true,
};

export default CardUser;

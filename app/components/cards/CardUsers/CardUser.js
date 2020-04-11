import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { MdClose } from 'react-icons/md';
import CircleButton from '../../common/CircleButton';
import PlaceholderImg from '../../common/PlaceholderImg';
import ReactTooltip from 'react-tooltip';

import { NOOP } from '../../../utils/constants';

import style from './card-users.css';
import { getStyleApplicationFn } from '../../../utils/style';

const s = getStyleApplicationFn(style);

const CardUser = ({ className, name, img, size, onClick, onRemoveClick, showName, showTooltip, ...rest }) => {
  const protectedOnClick = () => {
    if (onClick) onClick({ img, name });
  };

  const [isHovering, setHover] = useState(false);

  return (
    <div
      className={s(`card-user ${className}`)}
      {...rest}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className={s('relative')}>
        <CircleButton
          content={<PlaceholderImg src={img} name={name} className={s('w-full h-full text-sm')} />}
          size={size}
          onClick={protectedOnClick}
          data-tip
          data-for="card-user"
        />
        { onRemoveClick &&
          <button onClick={onRemoveClick} className={s('card-user-remove')}>
            <MdClose />
          </button>
        }        
      </div>
      { showName && <div className={s('card-user-label')}> {name} </div> }
      { isHovering && showTooltip &&
        <ReactTooltip id="card-user" effect="float">
          <span className={s('font-normal text-xs')}> {name} </span>
        </ReactTooltip>
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
    PropTypes.oneOf(['xs', 'sm', 'md', 'lg'])
  ]),
  onClick: PropTypes.func,
  onRemoveClick: PropTypes.func,
  showName: PropTypes.bool,
  showTooltip: PropTypes.bool,
};

CardUser.defaultProps = {
  className: '',
  size: 'md',
  showName: true,
  showTooltip: false,
};

export default CardUser;

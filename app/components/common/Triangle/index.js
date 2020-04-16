import React from 'react';
import PropTypes from 'prop-types';

import { getStyleApplicationFn } from 'utils/style';
const s = getStyleApplicationFn();

const getStyle = (direction, color, size, isInner) => {
  switch (direction) {
    case 'up':
      return {
        borderLeft: `${size}px solid transparent`,
        borderRight: `${size}px solid transparent`,
        borderBottom: `${size}px solid ${color}`,
        position: isInner ? 'absolute' : 'relative',
      };
    case 'down':
      return {
        borderLeft: `${size}px solid transparent`,
        borderRight: `${size}px solid transparent`,
        borderTop: `${size}px solid ${color}`,
        position: isInner ? 'absolute' : 'relative',
      };
    case 'right':
      return {
        borderTop: `${size}px solid transparent`,
        borderBottom: `${size}px solid transparent`,
        borderLeft: `${size}px solid ${color}`,
        position: isInner ? 'absolute' : 'relative',
      };
    case 'left':
      return {
        borderTop: `${size}px solid transparent`,
        borderBottom: `${size}px solid transparent`,
        borderRight: `${size}px solid ${color}`,
        position: isInner ? 'absolute' : 'relative',
      };
  }
};

const getPositionStyle = (direction, size, outlineSize) => {
  switch (direction) {
    case 'up': {
      return { top: `${outlineSize}px`, left: `-${size}px` };
    }
    case 'down': {
      return { top: `-${size + outlineSize}px`, left: `-${size}px` };
    }
    case 'left': {
      return { top: `-${size}px`, left: `${outlineSize}px` };
    }
    case 'right': {
      return { top: `-${size}px`, left: `-${size + outlineSize}px` };
    }
  }
}

const Triangle = ({ direction, color, size, outlineSize, outlineColor, className, style }) => {
  const innerStyle = { ...getStyle(direction, color, size, true), ...getPositionStyle(direction, size, outlineSize) };
  const outerStyle = getStyle(direction, outlineColor, size + outlineSize, false);

  return (
    <div className={s(`w-0 h-0 flex items-center ${className}`)} style={{ ...outerStyle, ...style }}>
      <div className={s('w-0 h-0')} style={innerStyle} />
    </div>
  );
};

Triangle.propTypes = {
  direction: PropTypes.oneOf(['up', 'down', 'left', 'right']).isRequired,
  color: PropTypes.string.isRequired,
  size: PropTypes.number.isRequired,
  className: PropTypes.string,
  style: PropTypes.object,
  outlineSize: PropTypes.number,
  outlineColor: PropTypes.string,
};

Triangle.defaultProps = {
  className: '',
  outlineSize: 0,
  outlineColor: 'transparent',
  style: {},
};

export default Triangle;

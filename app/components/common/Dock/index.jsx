import React from 'react';
import PropTypes from 'prop-types';
import { Transition } from 'react-transition-group';

import { getStyleApplicationFn } from 'utils/style';

import style from './dock.css';

const s = getStyleApplicationFn(style);

const getTransitionStyle = (isVisible, position, width) => {
  const positionStyle = {};

  if (position === 'left') {
    positionStyle.left = isVisible ? 0 : `-${width}px`;
  } else {
    positionStyle.right = isVisible ? 0 : `-${width}px`;
  }

  return positionStyle;
};

const Dock = ({
  position,
  width,
  isVisible,
  isFullHeight,
  children,
  transitionProps,
  transitionMs
}) => {
  const BASE_STYLE = {
    transition: `left ${transitionMs}ms ease-out 0s, right ${transitionMs}ms ease-out 0s`
  };

  const TRANSITION_STYLE = {
    entering: getTransitionStyle(true, position, width),
    entered: getTransitionStyle(true, position, width),
    exiting: getTransitionStyle(false, position, width),
    exited: { ...getTransitionStyle(false, position, width), width: 0 }
  };

  return (
    <Transition in={isVisible} timeout={transitionMs} mountOnEnter {...transitionProps}>
      {(state) => (
        <div
          className={s(`dock ${position === 'left' ? 'dock-left' : 'dock-right'}`)}
          style={{
            ...BASE_STYLE,
            ...TRANSITION_STYLE[state],
            width,
            height: isFullHeight ? '100%' : 'auto'
          }}
        >
          {children}
        </div>
      )}
    </Transition>
  );
};

Dock.propTypes = {
  position: PropTypes.oneOf(['left', 'right']),
  isVisible: PropTypes.bool.isRequired,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  isFullHeight: PropTypes.bool,
  transitionProps: PropTypes.shape({
    unmountOnExit: PropTypes.bool
  }),
  transitionMs: PropTypes.number,
  children: PropTypes.node.isRequired
};

Dock.defaultProps = {
  position: 'right',
  isFullHeight: true,
  transitionProps: {},
  transitionMs: 200
};

export default Dock;

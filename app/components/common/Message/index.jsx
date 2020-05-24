import React, { useEffect, useState } from 'react';
import AnimateHeight from 'react-animate-height';
import PropTypes from 'prop-types';

import { NOOP } from 'appConstants';
import { getStyleApplicationFn } from 'utils/style';
import style from './message.css';

const s = getStyleApplicationFn(style);

const getColorClassName = (type) => {
  switch (type) {
    case 'error':
      return 'text-red-500';
    case 'success':
      return 'text-green-500';
    default:
      return '';
  }
};

const Message = ({ message, type, className, animate, show, temporary, showDuration, onHide }) => {
  const [showState, setShowState] = useState(show);

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (show) {
      setShowState(true);

      if (temporary) {
        const timeoutId = setTimeout(() => {
          setShowState(false);
          if (!animate) onHide();
        }, showDuration);

        return () => {
          clearTimeout(timeoutId);
        };
      }
    }
  }, [show, onHide, showDuration, animate, temporary, setShowState]);

  const body = (
    <div className={s(`${className} ${getColorClassName(type)} message`)}>{message}</div>
  );

  const shouldShow = !!message && show && showState;
  if (animate) {
    return (
      <AnimateHeight
        height={shouldShow ? 'auto' : 0}
        onAnimationEnd={({ newHeight }) => newHeight === 0 && onHide()}
      >
        {body}
      </AnimateHeight>
    );
  }
  return shouldShow ? body : null;
};

Message.propTypes = {
  message: PropTypes.node,
  type: PropTypes.string,
  className: PropTypes.string,
  animate: PropTypes.bool,
  show: PropTypes.bool,
  temporary: PropTypes.bool,
  showDuration: PropTypes.number,
  onHide: PropTypes.func
};

Message.defaultProps = {
  className: '',
  animate: false,
  show: true,
  temporary: false,
  showDuration: 3000,
  onHide: NOOP
};

export default Message;

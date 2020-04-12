import React, { useEffect, useState } from 'react';
import AnimateHeight from 'react-animate-height';
import PropTypes from 'prop-types';

import style from './message.css';
import { getStyleApplicationFn } from 'utils/style';

const s = getStyleApplicationFn(style);

const getColorClassName = (type) => {
  switch (type) {
    case "error":
      return 'text-red-500';
    case "success":
      return 'text-green-500';
    default:
      return '';
  }
}

const Message = ({ message, type, className, animate, show, temporary, showDuration, onHide, ...rest }) => {
  const [showState, setShowState] = useState(show);
  
  const protectedOnHide = () => {
    if (onHide) onHide();
  }

  useEffect(() => {
    if (show && !showState) {
      setShowState(true);
    }

    if (temporary) {
      setTimeout(() => {
        setShowState(false);
        if (!animate) protectedOnHide();
      }, showDuration);
    }
  }, [show]);

  const body = (
    <div className={s(`${className} ${getColorClassName(type)} message`)} {...rest}>
      {message}
    </div>
  );

  const shouldShow = message && show && showState;

  if (animate) {
    return (
      <AnimateHeight
        height={shouldShow ? 'auto' : 0}
        onAnimationEnd={(newHeight) => newHeight === 0 && protectedOnHide()}
      >
        {body}
      </AnimateHeight>
    );
  } else {
    return shouldShow ? body : null;
  }
}

Message.propTypes = {
  message: PropTypes.any,
  type: PropTypes.string,
  className: PropTypes.string,
  animate: PropTypes.bool,
  show: PropTypes.bool,
  temporary: PropTypes.bool,
  showDuration: PropTypes.number,
  onHide: PropTypes.func,
}

Message.defaultProps = {
  className: '',
  animate: false,
  show: true,
  temporary: false,
  showDuration: 3000,
}

export default Message;
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import onClickOutside from 'react-onclickoutside';

import { getStyleApplicationFn } from 'utils/style';
const s = getStyleApplicationFn();

const getPositionStyle = (isDown, isLeft) => {
  const style = { position: 'absolute', zIndex: 10 };

  if (isDown) {
    style.top = '100%';
  } else {
    style.bottom = '100%';
  }

  if (isLeft) {
    style.right = '0';
  } else {
    style.left = '0';
  }

  return style;
};

const Dropdown = ({
  isDown, isLeft, toggler, body, isOpen, onToggle, disabled, isTogglerRelative, className, togglerClassName,
}) => {
  const [isOpenState, setOpenState] = useState(false);

  Dropdown.handleClickOutside = (e) => {
    e.stopPropagation();

    if (onToggle) {
      onToggle(false);
    } else {
      setOpenState(false);
    }
  };

  const onToggleClick = (e) => {
    if (!disabled) {
      if (onToggle) {
        onToggle(!isOpen);
      } else {
        setOpenState(!isOpenState);
      }
    }
  }

  const handleMouseBehavior = (e) => {
    if (!disabled) {
      e.stopPropagation();
    }
  }

  const style = getPositionStyle(isDown, isLeft);
  return (
    <div
      className={s(`${isTogglerRelative ? 'relative' : ''} ${className}`)}
      onClick={handleMouseBehavior}
      onMouseOver={handleMouseBehavior}
    >
      <div
        onClick={onToggleClick}
        className={s(`${togglerClassName} ${!disabled ? 'button-hover' : ''}`)}
      >
        {toggler}
      </div>
      { (isOpen != undefined ? isOpen : isOpenState) &&
        React.cloneElement(body, { style })
      }
    </div>
  );
}

Dropdown.propTypes = {
  isDown: PropTypes.bool,
  isLeft: PropTypes.bool,
  toggler: PropTypes.element.isRequired,
  body: PropTypes.element,
  isOpen: PropTypes.bool,
  onToggle: PropTypes.func,
  disabled: PropTypes.bool,
  isTogglerRelative: PropTypes.bool,
  className: PropTypes.string,
  togglerClassName: PropTypes.string,
};

Dropdown.defaultProps = {
  isDown: true,
  isLeft: true,
  disabled: false,
  isTogglerRelative: true,
  className: '',
  togglerClassName: '',
};


const clickOutsideConfig = {
  handleClickOutside: () => Dropdown.handleClickOutside
};

export default onClickOutside(Dropdown, clickOutsideConfig);

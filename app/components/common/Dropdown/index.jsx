import React, { Component } from 'react';
import PropTypes from 'prop-types';
import onClickOutside from 'react-onclickoutside';

import { NOOP } from 'appConstants';
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

/* Needs to be a class instead of const due to react-onclickoutside usage. */
class Dropdown extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false
    };
  }

  handleClickOutside = (e) => {
    const { onToggle } = this.props;

    e.stopPropagation();

    if (onToggle) {
      onToggle(false);
    } else {
      this.setState({ isOpen: false });
    }
  };

  onToggleClick = () => {
    const { disabled, onToggle, isOpen: propsIsOpen } = this.props;
    const { isOpen: stateIsOpen } = this.state;

    if (!disabled) {
      if (onToggle) {
        onToggle(!propsIsOpen);
      } else {
        this.setState({ isOpen: !stateIsOpen });
      }
    }
  };

  handleMouseBehavior = (e) => {
    const { disabled } = this.props;
    if (!disabled) {
      e.stopPropagation();
    }
  };

  render() {
    const {
      isDown,
      isLeft,
      toggler,
      body,
      disabled,
      isTogglerRelative,
      className,
      togglerClassName,
      isOpen: propsIsOpen
    } = this.props;
    const { isOpen: stateIsOpen } = this.state;

    const isOpen = propsIsOpen !== null ? propsIsOpen : stateIsOpen;
    const style = getPositionStyle(isDown, isLeft);

    return (
      <div
        className={s(`${isTogglerRelative ? 'relative' : ''} ${className}`)}
        onClick={this.handleMouseBehavior}
        onMouseOver={this.handleMouseBehavior}
        onFocus={NOOP}
      >
        <div
          onClick={this.onToggleClick}
          className={s(`${togglerClassName} ${!disabled ? 'button-hover' : ''}`)}
        >
          {toggler}
        </div>
        {isOpen && React.cloneElement(body, { style })}
      </div>
    );
  }
}

Dropdown.propTypes = {
  isDown: PropTypes.bool,
  isLeft: PropTypes.bool,
  toggler: PropTypes.node.isRequired,
  body: PropTypes.node,
  isOpen: PropTypes.bool,
  onToggle: PropTypes.func,
  disabled: PropTypes.bool,
  isTogglerRelative: PropTypes.bool,
  className: PropTypes.string,
  togglerClassName: PropTypes.string
};

Dropdown.defaultProps = {
  isOpen: null,
  onToggle: null,
  isDown: true,
  isLeft: true,
  body: null,
  disabled: false,
  isTogglerRelative: true,
  className: '',
  togglerClassName: ''
};

export default onClickOutside(Dropdown);

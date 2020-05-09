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

  onToggleClick = (e) => {
    const { disabled, onToggle, isOpen } = this.props;

    if (disabled) {
      NOOP();
    } else if (onToggle) {
      onToggle(!isOpen);
    } else {
      this.setState({ isOpen: !this.state.isOpen });
    }
  };

  handleMouseBehavior = (e) => {
    if (!this.props.disabled) {
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
      togglerClassName
    } = this.props;
    const isOpen = this.props.isOpen !== undefined ? this.props.isOpen : this.state.isOpen;

    const style = getPositionStyle(isDown, isLeft);

    return (
      <div
        className={s(`${isTogglerRelative ? 'relative' : ''} ${className}`)}
        onClick={this.handleMouseBehavior}
        onMouseOver={this.handleMouseBehavior}
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
  isDown: true,
  isLeft: true,
  disabled: false,
  isTogglerRelative: true,
  className: '',
  togglerClassName: ''
};

export default onClickOutside(Dropdown);

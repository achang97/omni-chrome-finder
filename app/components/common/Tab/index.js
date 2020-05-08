import React from 'react';
import PropTypes from 'prop-types';
import Ripples from 'react-ripples';

import { getStyleApplicationFn } from 'utils/style';
import style from './tab.css';

const s = getStyleApplicationFn(style);

const Tab = ({
  isActive,
  label,
  value,
  onTabClick,
  clickOnMouseDown,
  rippleClassName,
  tabContainerClassName,
  tabClassName,
  activeTabClassName,
  inactiveTabClassName,
  style,
  color,
  indicatorColor,
  showIndicator,
  showRipple,
  children,
  ...rest
}) => {
  let activeTabStyle = {};
  if (isActive && showIndicator) {
    activeTabStyle = {
      borderBottom: color || indicatorColor ? `2px solid ${indicatorColor || color}` : null
    };
  }

  const renderButton = () => (
    <div
      {...rest}
      onClick={() => onTabClick(value)}
      onMouseDown={() => clickOnMouseDown && onTabClick(value)}
      style={{ color }}
      className={s(`
        tab button-hover ${tabClassName}
        ${isActive ? `${activeTabClassName}` : `tab-inactive ${inactiveTabClassName}`}
      `)}
    >
      {label || children}
    </div>
  );

  return (
    <div className={s(tabContainerClassName)} style={{ ...style, ...activeTabStyle }} {...rest}>
      {showRipple ? (
        <Ripples className={s(`rounded h-full ${rippleClassName}`)}> {renderButton()} </Ripples>
      ) : (
        renderButton()
      )}
    </div>
  );
};

Tab.propTypes = {
  label: PropTypes.oneOfType([PropTypes.element, PropTypes.string, PropTypes.string]),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object]),
  isActive: PropTypes.bool,
  onTabClick: PropTypes.func,
  clickOnMouseDown: PropTypes.bool,
  rippleClassName: PropTypes.string,
  tabContainerClassName: PropTypes.string,
  tabClassName: PropTypes.string,
  activeTabClassName: PropTypes.string,
  inactiveTabClassName: PropTypes.string,
  style: PropTypes.object,
  color: PropTypes.string,
  indicatorColor: PropTypes.string,
  showIndicator: PropTypes.bool,
  showRipple: PropTypes.bool
};

Tab.defaultProps = {
  tabContainerClassName: '',
  rippleClassName: '',
  tabClassName: '',
  activeTabClassName: '',
  inactiveTabClassName: '',
  style: {}
};

export default Tab;

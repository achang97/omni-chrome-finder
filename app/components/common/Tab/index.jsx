import React from 'react';
import PropTypes from 'prop-types';
import Ripples from 'react-ripples';

import { getStyleApplicationFn } from 'utils/style';
import tabStyle from './tab.css';

const s = getStyleApplicationFn(tabStyle);

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
  children
}) => {
  let activeTabStyle = {};
  if (isActive && showIndicator) {
    activeTabStyle = {
      borderBottom: color || indicatorColor ? `2px solid ${indicatorColor || color}` : null
    };
  }

  const renderButton = () => (
    <div
      onClick={() => !clickOnMouseDown && onTabClick(value)}
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
    <div className={s(tabContainerClassName)} style={{ ...style, ...activeTabStyle }}>
      {showRipple ? (
        <Ripples className={s(`rounded h-full ${rippleClassName}`)}> {renderButton()} </Ripples>
      ) : (
        renderButton()
      )}
    </div>
  );
};

Tab.propTypes = {
  label: PropTypes.node,
  value: PropTypes.any, // eslint-disable-line react/forbid-prop-types
  isActive: PropTypes.bool,
  onTabClick: PropTypes.func,
  clickOnMouseDown: PropTypes.bool,
  rippleClassName: PropTypes.string,
  tabContainerClassName: PropTypes.string,
  tabClassName: PropTypes.string,
  activeTabClassName: PropTypes.string,
  inactiveTabClassName: PropTypes.string,
  style: PropTypes.shape({}),
  color: PropTypes.string,
  indicatorColor: PropTypes.string,
  showIndicator: PropTypes.bool,
  showRipple: PropTypes.bool,
  children: PropTypes.node
};

Tab.defaultProps = {
  label: null,
  value: null,
  isActive: null,
  onTabClick: null,
  clickOnMouseDown: true,
  tabContainerClassName: '',
  rippleClassName: '',
  tabClassName: '',
  activeTabClassName: '',
  inactiveTabClassName: '',
  style: {},
  color: null,
  indicatorColor: null,
  showIndicator: true,
  showRipple: false,
  children: null
};

export default Tab;

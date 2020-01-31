import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Ripples from 'react-ripples';

import style from './tabs.css';
import { getStyleApplicationFn } from '../../../utils/styleHelpers';
const s = getStyleApplicationFn(style);

const Tab = (props) => {
  const {
		isActive, label,
		onTabClick,
		rippleClassName, tabContainerClassName, tabClassName, activeTabClassName, inactiveTabClassName,
		color, indicatorColor, showIndicator,
		showRipple,
		children,
		...rest
	} = props;

  const activeTabStyle = {
    borderBottom: (color || indicatorColor) ? `2px solid ${indicatorColor || color}` : null,
  };

  const renderButton = () => (
    <div
      {...rest}
      onClick={onTabClick}
      style={{ color }}
      className={s(`
				tab button-hover ${tabClassName}
				${isActive ?
					`${activeTabClassName}` :
					`tab-inactive ${inactiveTabClassName}`}
			`)}
    >
      {label || children}
    </div>
	);

  return (
    <div className={s(tabContainerClassName)} style={(isActive && showIndicator) ? activeTabStyle : null} {...rest}>
      { showRipple ?
        <Ripples className={s(`rounded h-full ${rippleClassName}`)}> {renderButton()} </Ripples> :
				renderButton()
			}
    </div>
  );
}

Tab.propTypes = {
  label: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  isActive: PropTypes.bool,
  onTabClick: PropTypes.func,
  rippleClassName: PropTypes.string,
  tabContainerClassName: PropTypes.string,
  tabClassName: PropTypes.string,
  activeTabClassName: PropTypes.string,
  inactiveTabClassName: PropTypes.string,
  color: PropTypes.string,
  indicatorColor: PropTypes.string,
  showIndicator: PropTypes.bool,
  showRipple: PropTypes.bool,
};

Tab.defaultProps = {
  tabContainerClassName: '',
  rippleClassName: '',
  tabClassName: '',
  activeTabClassName: '',
  inactiveTabClassName: '',
};

export default Tab;

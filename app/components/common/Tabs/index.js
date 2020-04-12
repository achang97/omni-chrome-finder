import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import ReactResizeDetector from 'react-resize-detector';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import { animate } from 'utils/animate';
import { usePrevious } from 'utils/react';
import { DEBOUNCE } from 'appConstants/animate';

import Tab from '../Tab';

import style from './tabs.css';
import { getStyleApplicationFn } from 'utils/style';

const s = getStyleApplicationFn(style);

const Tabs = ({
  tabOptions, activeValue, onTabClick, clickOnMouseDown, style, className,
  allTabsContainerClassName, rippleClassName, tabContainerClassName, tabClassName,
  activeTabClassName, inactiveTabClassName, color, indicatorColor, showIndicator, showRipple,
  scrollButtonColor, children
}) => {
  const [displayScroll, setDisplayScroll] = useState({ start: false, end: false });
  const tabsRef = useRef(null);

  const prevChildren = usePrevious(children) || [];
  const prevTabOptions = usePrevious(tabOptions) || [];

  useEffect(() => {
    const numChildren = children ? children.length : 0;
    const numTabOptions = tabOptions ? tabOptions.length : 0;

    if (prevChildren.length !== numChildren || prevTabOptions.length !== numTabOptions) {
      handleResize();
    }

    if (prevChildren.length < numChildren || prevTabOptions.length < numTabOptions) {
      if (tabsRef.current) {
        const { scrollWidth, scrollLeft } = tabsRef.current;
        moveTabsScroll(scrollWidth - scrollLeft);
      }
    }    
  }, [children, tabOptions])

  const moveTabsScroll = (delta) => {
    if (tabsRef.current) {
      const scrollValue = tabsRef.current.scrollLeft + delta;
      animate('scrollLeft', tabsRef.current, scrollValue);
    }
  };

  const handleScrollClick = (isStart) => {
    moveTabsScroll((isStart ? -1 : 1) * tabsRef.current.clientWidth);
  };

  const handleResize = _.debounce(() => {
    if (tabsRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tabsRef.current;

      // use 1 for the potential rounding error with browser zooms.
      const showStartScroll = scrollLeft > 1;
      const showEndScroll = scrollLeft < scrollWidth - clientWidth - 1;

      if (showStartScroll !== displayScroll.start || showEndScroll !== displayScroll.end) {
        setDisplayScroll({ start: showStartScroll, end: showEndScroll });
      }      
    }
  }, DEBOUNCE.HZ_60)

  const protectedOnTabClick = (value) => {
    if (onTabClick) {
      onTabClick(value);
    }
  }

  const getBaseTabProps = (value, i) => {
    const actualValue = value || i;
    const isActive = activeValue === actualValue;

    return {
      isActive,
      value: actualValue,
      onTabClick: () => protectedOnTabClick(actualValue),
      clickOnMouseDown,
      rippleClassName,
      tabContainerClassName,
      tabClassName,
      activeTabClassName,
      inactiveTabClassName,
      color,
      indicatorColor,
      showIndicator,
      showRipple,
    };
  }

  const renderTab = ({ label, value }, i) => {
    const baseTabProps = getBaseTabProps(value, i);
    return (
      <Tab
        key={typeof (label) === 'string' ? label : i}
        label={label}
        {...baseTabProps}
      />
    );
  }

  const mergeProps = (baseProps, childProps) => {
    const mergedProps = baseProps;

    Object.entries(childProps).forEach(([propKey, childPropValue]) => {
      if (childPropValue !== undefined && childPropValue !== null & childPropValue !== '') {
        if (propKey.endsWith('ClassName')) {
          mergedProps[propKey] += ` ${childPropValue}`;
        } else {
          mergedProps[propKey] = childPropValue;
        }
      }
    });

    return mergedProps;
  }

  const renderChildren = () => {
    return (
      children.map((child, i) => (
        child && React.cloneElement(child, mergeProps(getBaseTabProps(child.props.value, i), child.props))
      ))
    );
  }

  const renderScrollButton = (isStart) => {
    const { start: displayScrollStart, end: displayScrollEnd } = displayScroll;
    const showScrollButtons = displayScrollStart || displayScrollEnd;

    if (!showScrollButtons) {
      return null;
    }

    const isDisabled = isStart ? !displayScrollStart : !displayScrollEnd;
    const Icon = isStart ? MdChevronLeft : MdChevronRight;

    return (
      <button disabled={isDisabled} className={s(isDisabled ? 'opacity-25' : '')}>
        <Icon onClick={() => handleScrollClick(isStart)} color={scrollButtonColor} />
      </button>
    );
  }

  return (
    <div className={s(`tabs-all-container ${className}`)} style={style}>
      {renderScrollButton(true)}
      <div
        ref={tabsRef}
        className={s(`tabs-tab-container hide-scrollbar ${allTabsContainerClassName}`)}
        onScroll={handleResize}
      >
        {tabOptions ?
          tabOptions.map((tabOption, i) => renderTab(tabOption, i)) :
          renderChildren()
        }
        <ReactResizeDetector handleWidth onResize={handleResize} />
      </div>
      {renderScrollButton(false)}
    </div>
  );
}

Tabs.propTypes = {
  tabOptions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.oneOfType([PropTypes.element, PropTypes.string, PropTypes.string]).isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object]),
  })),
  activeValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object]).isRequired,
  onTabClick: PropTypes.func.isRequired,
  clickOnMouseDown: PropTypes.bool,
  style: PropTypes.object,
  className: PropTypes.string,
  allTabsContainerClassName: PropTypes.string,
  rippleClassName: PropTypes.string,
  tabContainerClassName: PropTypes.string,
  tabClassName: PropTypes.string,
  activeTabClassName: PropTypes.string,
  inactiveTabClassName: PropTypes.string,
  color: PropTypes.string,
  indicatorColor: PropTypes.string,
  showIndicator: PropTypes.bool,
  showRipple: PropTypes.bool,
  scrollButtonColor: PropTypes.string,
  children: PropTypes.arrayOf(PropTypes.element)
};

Tabs.defaultProps = {
  clickOnMouseDown: false,
  style: {},
  className: '',
  allTabsContainerClassName: '',
  tabContainerClassName: '',
  rippleClassName: '',
  tabClassName: '',
  activeTabClassName: '',
  inactiveTabClassName: '',
  showIndicator: true,
  showRipple: true,
};

export default Tabs;

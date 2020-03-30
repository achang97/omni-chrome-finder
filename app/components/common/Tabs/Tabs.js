import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import ReactResizeDetector from 'react-resize-detector';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import { animate } from '../../../utils/animate';
import { DEBOUNCE_60_HZ } from '../../../utils/constants';

import Tab from './Tab';

import style from './tabs.css';
import { getStyleApplicationFn } from '../../../utils/style';

const s = getStyleApplicationFn(style);

const CLASSNAME_PROPS = ['tabContainerClassName', 'rippleClassName', 'tabClassName', 'activeTabClassName', 'inactiveTabClassName'];

class Tabs extends Component {
  constructor(props) {
    super(props);

    this.state = {
      displayScroll: {
        start: false,
        end: false
      }
    };

    this.tabsRef = React.createRef();
  }

  componentDidUpdate(prevProps) {
    const { children = [], tabOptions = [] } = this.props;
    const { children: prevChildren = [], tabOptions: prevTabOptions = [] } = prevProps;

    if (prevChildren.length !== children.length || prevTabOptions.length !== tabOptions.length) {
      this.handleResize();
    }

    if (prevChildren.length < children.length || prevTabOptions.length < tabOptions.length) {
      if (this.tabsRef.current) {
        const { scrollWidth, scrollLeft } = this.tabsRef.current;
        this.moveTabsScroll(scrollWidth - scrollLeft);
      }
    }
  }

  moveTabsScroll = (delta) => {
    if (this.tabsRef.current) {
      const scrollValue = this.tabsRef.current.scrollLeft + delta;
      animate('scrollLeft', this.tabsRef.current, scrollValue);
    }
  };

  handleScrollClick = (isStart) => {
    this.moveTabsScroll((isStart ? -1 : 1) * this.tabsRef.current.clientWidth);
  };

  handleResize = _.debounce(() => {
    if (this.tabsRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = this.tabsRef.current;
      const { displayScroll } = this.state;

      // use 1 for the potential rounding error with browser zooms.
      const showStartScroll = scrollLeft > 1;
      const showEndScroll = scrollLeft < scrollWidth - clientWidth - 1;

      if (showStartScroll !== displayScroll.start || showEndScroll !== displayScroll.end) {
        this.setState({ displayScroll: { start: showStartScroll, end: showEndScroll } });
      }      
    }
  }, DEBOUNCE_60_HZ)

  onTabClick = (value) => {
    const { onTabClick } = this.props;
    if (onTabClick) {
      onTabClick(value);
    }
  }

  getBaseTabProps = (value, i) => {
    const {
      activeValue,
      rippleClassName, tabContainerClassName, tabClassName, activeTabClassName, inactiveTabClassName,
      color, indicatorColor, showIndicator,
      showRipple, clickOnMouseDown,
    } = this.props;

    const actualValue = value || i;
    const isActive = activeValue === actualValue;

    return {
      isActive,
      value: actualValue,
      onTabClick: () => this.onTabClick(actualValue),
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

  renderTab = ({ label, value }, i) => {
    const baseTabProps = this.getBaseTabProps(value, i);
    return (
      <Tab
        key={typeof (label) === 'string' ? label : i}
        label={label}
        {...baseTabProps}
      />
    );
  }

  mergeProps = (baseProps, childProps) => {
    const mergedProps = baseProps;

    Object.entries(childProps).forEach(([propKey, childPropValue]) => {
      if (childPropValue !== undefined && childPropValue !== null & childPropValue !== '') {
        if (CLASSNAME_PROPS.includes(propKey)) {
          mergedProps[propKey] += ` ${childPropValue}`;
        } else {
          mergedProps[propKey] = childPropValue;
        }
      }
    });

    return mergedProps;
  }

  renderChildren = () => {
    const { children } = this.props;
    return (
      children.map((child, i) => (
        child && React.cloneElement(child, this.mergeProps(this.getBaseTabProps(child.props.value, i), child.props))
      ))
    );
  }

  renderScrollButton = (isStart) => {
    const { scrollButtonColor } = this.props;
    const { displayScroll: { start: displayScrollStart, end: displayScrollEnd } } = this.state;
    const showScrollButtons = displayScrollStart || displayScrollEnd;

    if (!showScrollButtons) {
      return null;
    }

    const isDisabled = isStart ? !displayScrollStart : !displayScrollEnd;
    const Icon = isStart ? MdChevronLeft : MdChevronRight;

    return (
      <button disabled={isDisabled} className={s(isDisabled ? 'opacity-25' : '')}>
        <Icon onClick={() => this.handleScrollClick(isStart)} color={scrollButtonColor} />
      </button>
    );
  }

  render() {
    const { tabOptions, className, allTabsContainerClassName, style } = this.props;
    return (
      <div className={s(`tabs-all-container ${className}`)} style={style}>
        {this.renderScrollButton(true)}
        <div
          ref={this.tabsRef}
          className={s(`tabs-tab-container hide-scrollbar ${allTabsContainerClassName}`)}
          onScroll={this.handleResize}
        >
          {tabOptions ?
            tabOptions.map((tabOption, i) => this.renderTab(tabOption, i)) :
            this.renderChildren()
          }
          <ReactResizeDetector handleWidth onResize={this.handleResize} />
        </div>
        {this.renderScrollButton(false)}
      </div>
    );
  }
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
